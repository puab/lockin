import BottomSheet from '../../../components/BottomSheet';
import { StyleSheet, View } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { COLORS, ICONS } from '../../../Theme';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';
import useErrorStack from '../../../hooks/useErrorStack';
import { useEffect, useMemo, useState } from 'react';
import IconSelector from './IconSelector';
import FormTextField from '../../../components/FormTextField';
import DailyGoalControl from './DailyGoalControl';
import ColorSelector from '../../../components/ColorSelector';
import { Habit } from '../Types';
import { uuid } from '../../../Util';
import HeaderText from '../../../components/HeaderText';

type CreateOrUpdateHabitSheetProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    editTarget: Habit | null;
};

export default function CreateOrUpdateHabitSheet({
    open,
    setOpen,
    editTarget,
}: CreateOrUpdateHabitSheetProps) {
    const isEditing = !!editTarget;

    const createHabit = useAppStore(useShallow(s => s.createHabit));
    const updateHabit = useAppStore(useShallow(s => s.updateHabit));

    const { errors, validate } = useErrorStack();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dailyGoal, setDailyGoal] = useState<number>(1);
    const [icon, setIcon] = useState<string>(ICONS[0]);
    const [color, setColor] = useState<string>('white');

    function reset() {
        setName('');
        setDescription('');
        setDailyGoal(1);
        setIcon(ICONS[0]);
        setColor('white');
    }

    useEffect(() => {
        if (!open) return;

        if (isEditing) {
            setName(editTarget.name);
            setDescription(editTarget.description);
            setDailyGoal(editTarget.dailyGoal);
            setIcon(editTarget.icon);
            setColor(editTarget.color);
        } else reset();
    }, [open]);

    function handleCreateOrUpdate() {
        const habit: Habit = {
            id: isEditing ? editTarget.id : uuid(),
            name,
            description,
            icon,
            color,
            dailyGoal,
            completionMatrix: isEditing ? editTarget.completionMatrix : {},
        };

        const v1 = validate('name', name.length > 0, 'Name is required');

        if (v1) {
            if (isEditing) updateHabit(habit);
            else createHabit(habit);

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
                            {isEditing ? 'Update' : 'New'} habit
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
                label='Description'
                value={description}
                onChange={setDescription}
                numberOfLines={5}
                multiline
            />

            <DailyGoalControl
                value={dailyGoal}
                setValue={setDailyGoal}
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
