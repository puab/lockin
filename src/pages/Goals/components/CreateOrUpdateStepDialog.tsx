import {
    Button,
    Checkbox,
    Dialog,
    Portal,
    SegmentedButtons,
    Text,
} from 'react-native-paper';
import FormTextField from '../../../components/FormTextField';
import { GoalStep } from '../Types';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import useErrorStack from '../../../hooks/useErrorStack';
import AppTheme from '../../../Theme';
import { uuid, WEEKDAYS } from '../../../Util';
import WeekdaySelector from './WeekdaySelector';

type CreateOrUpdateStepDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onAdd: (step: GoalStep) => void;
    onUpdate: (step: GoalStep) => void;
    editTarget: GoalStep | null;
};

export default function CreateOrUpdateStepDialog({
    open,
    setOpen,
    onAdd,
    onUpdate,
    editTarget,
}: CreateOrUpdateStepDialogProps) {
    const isEditing = !!editTarget;
    const { errors, validate, clear } = useErrorStack();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [repeatType, setRepeatType] = useState<
        'never' | 'daily' | 'specific-week-days'
    >('never');
    const [repeatWeekdays, setRepeatWeekdays] = useState<number[]>(WEEKDAYS);
    const [showInTaskList, setShowInTaskList] = useState<boolean>(false);

    useEffect(() => {
        if (!open) return;

        if (editTarget) {
            setName(editTarget.name);
            setDescription(editTarget.description || '');
            setRepeatType(
                editTarget.repeat === false
                    ? 'never'
                    : editTarget.repeat === true
                    ? 'daily'
                    : 'specific-week-days'
            );
            setRepeatWeekdays(
                editTarget.repeat === false
                    ? WEEKDAYS
                    : editTarget.repeat === true
                    ? WEEKDAYS
                    : editTarget.repeat
            );
            setShowInTaskList(editTarget.showInTaskList || false);
        } else reset();
    }, [open]);

    function reset() {
        setName('');
        setDescription('');
        setRepeatType('never');
        setRepeatWeekdays(WEEKDAYS);
        setShowInTaskList(false);
        clear();
    }

    function handleAddOrUpdate() {
        const goalStep: GoalStep = {
            id: isEditing ? editTarget.id : uuid(),
            name,
            completed: false,
            repeat:
                repeatType == 'never'
                    ? false
                    : repeatType == 'daily'
                    ? true
                    : repeatWeekdays.sort((a, b) => a - b),
        };

        if (description != '') {
            goalStep.description = description;
        }

        if (repeatType != 'never') {
            goalStep.showInTaskList = showInTaskList;
        }

        if (repeatType === 'specific-week-days') {
            if (repeatWeekdays.length === 7) {
                goalStep.repeat = true;
            }
        }

        const v1 = validate('name', name.length > 0, 'Name is required');

        const v2 =
            repeatType !== 'specific-week-days' ||
            validate(
                'week-days',
                repeatWeekdays.length > 0,
                'At least one day must be selected'
            );

        if (v1 && v2) {
            if (isEditing) {
                onUpdate(goalStep);
            } else {
                onAdd(goalStep);
            }

            setOpen(false);
        }
    }

    return (
        <Portal>
            <Dialog
                visible={open}
                onDismiss={() => setOpen(false)}
            >
                <Dialog.Title style={{ fontWeight: 'bold' }}>
                    {isEditing ? 'Edit' : 'New'} step
                </Dialog.Title>
                <Dialog.Content style={S.content}>
                    <FormTextField
                        label='Name'
                        value={name}
                        onChange={setName}
                        errors={errors.name}
                    />

                    <FormTextField
                        label='Description'
                        value={description}
                        onChange={setDescription}
                        multiline
                        numberOfLines={3}
                    />

                    <View style={{ marginTop: 5, gap: 5 }}>
                        <Text style={{ marginLeft: 5 }}>Occurance</Text>

                        <SegmentedButtons
                            value={repeatType}
                            onValueChange={v =>
                                setRepeatType(
                                    v as
                                        | 'never'
                                        | 'daily'
                                        | 'specific-week-days'
                                )
                            }
                            theme={{
                                colors: {
                                    secondaryContainer:
                                        AppTheme.colors.primaryContainer,
                                },
                            }}
                            buttons={[
                                {
                                    value: 'never',
                                    label: 'Never',
                                    checkedColor: AppTheme.colors.primary,
                                    style: {
                                        borderTopLeftRadius: 5,
                                        borderBottomLeftRadius: 5,
                                    },
                                },
                                {
                                    value: 'daily',
                                    label: 'Daily',
                                    checkedColor: AppTheme.colors.primary,
                                },
                                {
                                    value: 'specific-week-days',
                                    label: 'Weekly',
                                    checkedColor: AppTheme.colors.primary,
                                    style: {
                                        borderTopRightRadius: 5,
                                        borderBottomRightRadius: 5,
                                    },
                                },
                            ]}
                        />
                    </View>

                    {repeatType == 'specific-week-days' && (
                        <WeekdaySelector
                            value={repeatWeekdays}
                            onChange={setRepeatWeekdays}
                            errors={errors['week-days']}
                        />
                    )}

                    {repeatType != 'never' && (
                        <Checkbox.Item
                            label='Show in tasklist'
                            status={showInTaskList ? 'checked' : 'unchecked'}
                            onPress={() => setShowInTaskList(r => !r)}
                        />
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onPress={handleAddOrUpdate}
                        mode='contained'
                    >
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const S = StyleSheet.create({
    content: {
        gap: 5,
    },
});
