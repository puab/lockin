import { DateTime } from 'luxon';
import BottomSheet from '../../../components/BottomSheet';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { COLORS, ICONS } from '../../../Theme';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';
import useErrorStack from '../../../hooks/useErrorStack';
import { useMemo, useState } from 'react';
import IconSelector from './IconSelector';
import FormTextField from '../../../components/FormTextField';
import DailyGoalControl from './DailyGoalControl';
import ColorSelector from '../../../components/ColorSelector';
import { Habit } from '../Types';
import { uuid } from '../../../Util';
import HeaderText from '../../../components/HeaderText';

type NewHabitSheetProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function NewHabitSheet({ open, setOpen }: NewHabitSheetProps) {
    const addHabit = useAppStore(useShallow(s => s.addHabit));

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

    function handleCreate() {
        const habit: Habit = {
            id: uuid(),
            name,
            description,
            icon,
            color,
            dailyGoal,
            completionMatrix: {},
        };

        const v1 = validate('name', name.length > 0, 'Name is required');

        if (v1) {
            addHabit(habit);
            setOpen(false);
        }
    }

    return (
        <BottomSheet
            open={open}
            setOpen={setOpen}
            handleColor={COLORS[color]}
            onDismiss={reset}
        >
            {useMemo(
                () => (
                    <View style={S.header}>
                        <HeaderText style={{ color: COLORS[color] }}>
                            New task
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
                onPress={handleCreate}
                icon={icon}
            >
                Create
            </Button>
        </BottomSheet>
    );
}

const S = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingBottom: 10,
        gap: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
