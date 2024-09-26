import {
    Button,
    Dialog,
    HelperText,
    Portal,
    Text,
    TextInput,
} from 'react-native-paper';
import { useEffect, useState } from 'react';
import useErrorStack from '../../../hooks/useErrorStack';
import FormTextField from '../../../components/FormTextField';
import ColorSelector from '../../../components/ColorSelector';
import { StyleSheet, View } from 'react-native';
import AppTheme, { COLORS, ICONS } from '../../../Theme';
import { DateTime } from 'luxon';
import LS from '../../../LocalStorage';
import { useAppContext } from '../../../contexts/AppContext';
import { Habit } from '../Types';
import IconSelector from './IconSelector';
import DailyGoalControl from './DailyGoalControl';

type EditDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    habit: Habit | null;
};

export default function EditDialog({ open, setOpen, habit }: EditDialogProps) {
    const reloadHabitsFromStorage = useAppContext(
        s => s.reloadHabitsFromStorage
    );

    const [busy, setBusy] = useState<boolean>(false);
    const { errors, validate } = useErrorStack();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dailyGoal, setDailyGoal] = useState<number>(1);
    const [icon, setIcon] = useState<string>(ICONS[0]);
    const [color, setColor] = useState<string>('white');

    useEffect(() => {
        if (habit) {
            setName(habit.name);
            setDescription(habit.description);
            setDailyGoal(habit.dailyGoal);
            setIcon(habit.icon);
            setColor(habit.color);
        }
    }, [habit]);

    async function handleSave() {
        if (!habit) return;

        setBusy(true);

        const freshHabit: Habit = {
            ...habit,
            name,
            description,
            dailyGoal,
            icon,
            color,
            updatedAt: DateTime.now().toMillis(),
        };

        const v1 = validate('name', name.length > 0, 'Name is required');

        if (v1) {
            await LS.habits.updateHabit(freshHabit);
            await reloadHabitsFromStorage();
            setOpen(false);
        }

        setBusy(false);
    }

    return (
        <Portal>
            <Dialog
                visible={open}
                onDismiss={() => setOpen(false)}
            >
                {/* fake Dialog.Title */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 25,
                        marginBottom: 15,
                    }}
                >
                    <Text
                        style={{
                            color: COLORS[color],
                        }}
                        variant='titleLarge'
                    >
                        Edit habit
                    </Text>
                    <IconSelector
                        value={icon}
                        onChange={setIcon}
                        iconColor={COLORS[color]}
                    />
                </View>

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
                        numberOfLines={5}
                        multiline
                    />

                    {/* <DailyGoalControl
                        value={dailyGoal}
                        setValue={setDailyGoal}
                    /> */}

                    <ColorSelector
                        value={color}
                        onChange={setColor}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onPress={handleSave}
                        mode='contained'
                        style={{ backgroundColor: COLORS[color] }}
                        loading={busy}
                    >
                        Save
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const S = StyleSheet.create({
    content: {
        gap: 10,
    },
});
