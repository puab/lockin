import { useEffect, useMemo, useState } from 'react';
import BottomSheet from '../../../components/BottomSheet';
import { COLORS, ICONS } from '../../../Theme';
import { StyleSheet, View } from 'react-native';
import HeaderText from '../../../components/HeaderText';
import IconSelector from '../../Habits/components/IconSelector';
import { Button, Divider } from 'react-native-paper';
import ColorSelector from '../../../components/ColorSelector';
import FormTextField from '../../../components/FormTextField';
import useErrorStack from '../../../hooks/useErrorStack';
import { Goal, GoalStep } from '../Types';
import GoalStepController from './GoalStepController';
import { uuid } from '../../../Util';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';

type CreateOrUpdateGoalSheetProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    editTarget: Goal | null;
};

export default function CreateOrUpdateGoalSheet({
    open,
    setOpen,
    editTarget,
}: CreateOrUpdateGoalSheetProps) {
    const isEditing = !!editTarget;

    const createGoal = useAppStore(useShallow(s => s.createGoal));
    const updateGoal = useAppStore(useShallow(s => s.updateGoal));

    const { errors, validate } = useErrorStack();

    const [name, setName] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [icon, setIcon] = useState<string>(ICONS[0]);
    const [color, setColor] = useState<string>('white');
    const [steps, setSteps] = useState<GoalStep[]>([]);
    const [completed, setCompleted] = useState<boolean>(false);

    const [endAtDate, setEndAtDate] = useState<Date | undefined>(undefined);

    function reset() {
        setName('');
        setReason('');
        setIcon(ICONS[0]);
        setColor('white');
        setSteps([]);
        setEndAtDate(undefined);
    }

    useEffect(() => {
        if (!open) return;

        if (isEditing) {
            setName(editTarget.name);
            setReason(editTarget.reason);
            setIcon(editTarget.icon);
            setColor(editTarget.color);
            setSteps(editTarget.steps);
            setCompleted(editTarget.completed);
            setEndAtDate(
                editTarget.endAt ? new Date(editTarget.endAt) : undefined
            );
        } else reset();
    }, [open]);

    function handleCreate() {
        const goal: Goal = {
            id: isEditing ? editTarget.id : uuid(),
            name,
            reason,
            color,
            icon,
            steps,
            completed,
            endAt: endAtDate?.getTime(),
        };

        const v1 = validate('name', !!name, 'Name is required');
        const v2 = validate('reason', !!reason, 'Reason is required');

        if (v1 && v2) {
            if (isEditing) updateGoal(goal);
            else createGoal(goal);

            reset();
            setOpen(false);
        }
    }

    return (
        <BottomSheet
            open={open}
            setOpen={setOpen}
            handleColor={COLORS[color]}
        >
            {useMemo(
                () => (
                    <View style={S.header}>
                        <HeaderText style={{ color: COLORS[color] }}>
                            {isEditing ? 'Update' : 'New'} goal
                        </HeaderText>

                        <IconSelector
                            value={icon}
                            onChange={setIcon}
                            iconColor={COLORS[color]}
                        />
                    </View>
                ),
                [color, icon]
            )}

            <FormTextField
                label='Name'
                value={name}
                onChange={setName}
                errors={errors.name}
            />

            <FormTextField
                label='Reason (be specific)'
                value={reason}
                onChange={setReason}
                errors={errors.reason}
                multiline
                numberOfLines={2}
            />

            <GoalStepController
                isEditing={isEditing}
                value={steps}
                onChange={setSteps}
            />

            <Divider style={{ marginTop: 'auto' }} />

            <ColorSelector
                value={color}
                onChange={setColor}
            />

            <Button
                mode='contained'
                style={{ backgroundColor: COLORS[color] }}
                onPress={handleCreate}
                icon={icon}
            >
                {isEditing ? 'Update' : 'Create'}
            </Button>
        </BottomSheet>
    );
}

const S = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
