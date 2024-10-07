import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import BottomSheet from '../../../components/BottomSheet';
import { Button, Divider, HelperText, Text } from 'react-native-paper';
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
import { isValidDateString, uuid } from '../../../Util';
import HeaderText from '../../../components/HeaderText';

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

    const addTask = useAppStore(useShallow(s => s.addTask));
    const updateTask = useAppStore(useShallow(s => s.updateTask));
    const { errors, validate, clear } = useErrorStack();

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [description, setDescription] = useState<string>('');
    const [color, setColor] = useState<string>('white');

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
        } else reset();
    }, [open]);

    function handleCreateOrUpdate() {
        const task: Task = {
            id: isEditing ? editTarget.id : uuid(),
            color,
            description,
            date: DateTime.fromJSDate(date as Date).toFormat('yyyy-LL-dd'),
            completed: false,
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
            if (isEditing) updateTask(task);
            else addTask(task);

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
