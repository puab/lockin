import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import BottomSheet from '../../../components/BottomSheet';
import {
    Button,
    Checkbox,
    Divider,
    HelperText,
    SegmentedButtons,
    Text,
} from 'react-native-paper';
import AppTheme, { COLORS } from '../../../Theme';
import { useEffect, useMemo, useState } from 'react';
import useErrorStack from '../../../hooks/useErrorStack';
import { DatePickerInput } from 'react-native-paper-dates';
import { DateTime } from 'luxon';
import FormTextField from '../../../components/FormTextField';
import ColorSelector from '../../../components/ColorSelector';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';
import { Task } from '../Types';
import { isValidDateString, secondsToHuman, uuid } from '../../../Util';
import HeaderText from '../../../components/HeaderText';

import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';

type CreateOrUpdateTaskSheetProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeDate?: DateTime;
    editTarget: Task | null;
};

export default function CreateOrUpdateTaskSheet({
    open,
    setOpen,
    activeDate,
    editTarget,
}: CreateOrUpdateTaskSheetProps) {
    const isEditing = !!editTarget;

    const createTask = useAppStore(useShallow(s => s.createTask));
    const updateTask = useAppStore(useShallow(s => s.updateTask));
    const { errors, validate, clear } = useErrorStack();

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [description, setDescription] = useState<string>('');
    const [color, setColor] = useState<string>('white');
    const [completed, setCompleted] = useState<boolean>(false);

    const [remindMe, setRemindMe] = useState<boolean>(false);
    const [remindType, setRemindType] = useState<
        'morning-of' | 'evening-before'
    >('morning-of');
    const [notificationId, setNotificationId] = useState<string | undefined>(
        undefined
    );

    function reset() {
        setDate(activeDate?.toJSDate() ?? new Date());
        setDescription('');
        setColor('white');
        clear();
    }

    useEffect(() => setDate(activeDate?.toJSDate()), [activeDate]);

    useEffect(() => {
        if (!open) return;

        if (editTarget) {
            setDate(
                DateTime.fromFormat(editTarget.date, 'yyyy-LL-dd').toJSDate()
            );
            setDescription(editTarget.description);
            setColor(editTarget.color);
            setRemindMe(editTarget.remindMe);
            setRemindType(editTarget.remindType);
            setNotificationId(editTarget.notificationId);
            setCompleted(editTarget.completed);
        } else reset();
    }, [open]);

    async function handleCreateOrUpdate() {
        const task: Task = {
            id: isEditing ? editTarget.id : uuid(),
            color,
            description,
            date: DateTime.fromJSDate(date as Date).toFormat('yyyy-LL-dd'),
            completed,
            remindMe,
            remindType,
            notificationId,
        };

        const v1 = validate(
            'date',
            isValidDateString(task.date),
            'A valid date is required'
        );

        const v2 = validate(
            'description',
            description.length > 0,
            'Description is required'
        );

        if (v1 && v2) {
            if (remindMe) {
                const { status } =
                    await Notifications.requestPermissionsAsync();

                if (status != 'granted') {
                    alert('Permission to show notifications was denied');
                    return;
                }

                let when = DateTime.fromJSDate(date as Date);

                if (remindType === 'morning-of') {
                    when = when.startOf('day').plus({ hours: 8 }); // current day 8:00
                } else if (remindType === 'evening-before') {
                    when = when.startOf('day').minus({ hours: 6 }); // previous day 18:00
                }

                const triggerInSeconds = Math.max(
                    when.diffNow('seconds').toObject().seconds as number,
                    30
                );

                const humanStr = secondsToHuman(triggerInSeconds);

                const notificationId =
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Let's get it done!",
                            body: `Task reminder: ${description}`,
                            // data: { data: 'goes here' },
                        },
                        trigger: { seconds: triggerInSeconds },
                    });

                if (isEditing && task.notificationId) {
                    await Notifications.cancelScheduledNotificationAsync(
                        task.notificationId
                    );
                }

                task.notificationId = notificationId;

                if (humanStr) {
                    Toast.show({
                        type: 'success',
                        text1: 'Task reminder set!',
                        text2: `In ${humanStr}`,
                    });
                }
            }

            if (!remindMe && isEditing && task.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(
                    task.notificationId
                );

                task.notificationId = undefined;
            }

            if (isEditing) updateTask(task);
            else createTask(task);

            setOpen(false);
        }
    }

    return (
        <BottomSheet
            open={open}
            setOpen={setOpen}
            handleColor={COLORS[color]}
        >
            <HeaderText style={{ color: COLORS[color] }}>
                {isEditing ? 'Update' : 'New'} task
            </HeaderText>

            <View style={{ marginVertical: 30 }}>
                <DatePickerInput
                    locale='en-GB'
                    label='Date'
                    value={date}
                    onChange={d => setDate(d)}
                    inputMode='start'
                    mode='outlined'
                    startWeekOnMonday={true}
                    presentationStyle='pageSheet'
                    validRange={{
                        startDate: DateTime.now().minus({ days: 1 }).toJSDate(),
                    }}
                    outlineStyle={[
                        errors.date != undefined && {
                            borderWidth: 2,
                            borderColor: AppTheme.colors.error,
                        },
                    ]}
                    theme={
                        errors.date != undefined
                            ? {
                                  colors: {
                                      primary: AppTheme.colors.error,
                                  },
                              }
                            : {}
                    }
                />
            </View>

            <View style={{ marginTop: -10 }}>
                {errors.date?.map((err, idx) => (
                    <HelperText
                        type='error'
                        visible={true}
                        key={`dateerr${idx}`}
                    >
                        {err}
                    </HelperText>
                ))}
            </View>

            <Checkbox.Item
                label='Remind me'
                status={remindMe ? 'checked' : 'unchecked'}
                onPress={() => setRemindMe(r => !r)}
                style={{ marginVertical: -10 }}
            />

            {remindMe && (
                <SegmentedButtons
                    value={remindType}
                    onValueChange={v =>
                        setRemindType(v as 'morning-of' | 'evening-before')
                    }
                    theme={{
                        colors: {
                            secondaryContainer:
                                AppTheme.colors.primaryContainer,
                        },
                    }}
                    buttons={[
                        {
                            value: 'morning-of',
                            label: 'Morning',
                            checkedColor: AppTheme.colors.primary,
                            style: {
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                            },
                        },
                        {
                            value: 'evening-before',
                            label: 'Evening before',
                            checkedColor: AppTheme.colors.primary,
                            style: {
                                borderTopRightRadius: 5,
                                borderBottomRightRadius: 5,
                            },
                        },
                    ]}
                />
            )}

            <FormTextField
                label='Description'
                value={description}
                onChange={setDescription}
                errors={errors.description}
                numberOfLines={5}
                multiline
            />

            <Divider style={{ marginTop: 'auto' }} />

            <ColorSelector
                value={color}
                onChange={setColor}
            />

            <Button
                mode='contained'
                style={{ backgroundColor: COLORS[color] }}
                onPress={handleCreateOrUpdate}
            >
                {isEditing ? 'Update' : 'Create'}
            </Button>
        </BottomSheet>
    );
}
