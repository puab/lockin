import { ScrollView, StyleSheet, View } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { Button, Portal, Snackbar, Text } from 'react-native-paper';
import { useEffect, useMemo, useRef, useState } from 'react';
import { COLORS } from '../../Theme';
import { useAppContext } from '../../contexts/AppContext';
import HabitItem from './components/HabitItem';
import { Habit } from './Types';
import LS from '../../LocalStorage';
import { DateNowStr } from '../../Util';
import EditDialog from './components/EditDialog';

export default function HabitScreen({ navigation }) {
    const habits = useAppContext<Habit[]>(s => s.habits);
    const reloadHabitsFromStorage = useAppContext(
        s => s.reloadHabitsFromStorage
    );

    async function wantsCompletion(habit: Habit) {
        if (habit.completionMatrix[DateNowStr] === habit.dailyGoal) return;
        await LS.habits.addCompletionToHabit(habit);
        await reloadHabitsFromStorage();
    }

    const [justDeleted, setJustDeleted] = useState<boolean>(false);
    const deleteTargetRef = useRef<Habit | null>(null);
    async function wantsDelete(habit: Habit) {
        deleteTargetRef.current = habit;
        await LS.habits.deleteHabit(habit);
        await reloadHabitsFromStorage();
        setJustDeleted(true);
    }

    const [isEditing, setEditing] = useState<boolean>(false);
    const editTargetRef = useRef<Habit | null>(null);
    async function wantsEdit(habit: Habit) {
        editTargetRef.current = habit;
        setEditing(true);
    }

    async function wantsFakeData(habit: Habit) {
        await LS.habits.populateFakeCompletion(habit, 100);
        await reloadHabitsFromStorage();
    }

    useEffect(() => {
        navigation?.setOptions({
            headerRight: () => (
                <Button
                    style={{ marginRight: 15 }}
                    mode='elevated'
                    icon={'plus'}
                    onPress={() => {
                        setJustDeleted(false);

                        navigation?.navigate('New habit');
                    }}
                >
                    Create
                </Button>
            ),
        });
    }, []);

    return (
        <PageLayout style={S.page}>
            {useMemo(
                () => (
                    <ScrollView>
                        <View style={S.list}>
                            {habits.map(habit => (
                                <HabitItem
                                    key={`habit${habit.id}`}
                                    habit={habit}
                                    wantsCompletion={() =>
                                        wantsCompletion(habit)
                                    }
                                    wantsDelete={() => wantsDelete(habit)}
                                    wantsEdit={() => wantsEdit(habit)}
                                    wantsFakeData={() => wantsFakeData(habit)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                ),
                [JSON.stringify(habits)]
            )}

            {useMemo(
                () => (
                    <EditDialog
                        open={isEditing}
                        setOpen={setEditing}
                        habit={editTargetRef.current as Habit}
                    />
                ),
                [isEditing]
            )}

            {useMemo(
                () => (
                    <Portal>
                        <Snackbar
                            visible={justDeleted}
                            onDismiss={() => {
                                deleteTargetRef.current = null;
                                setJustDeleted(false);
                            }}
                            action={{
                                label: 'Undo',
                                onPress: async () => {
                                    if (deleteTargetRef.current) {
                                        await LS.habits.createHabit(
                                            deleteTargetRef.current
                                        ),
                                            await reloadHabitsFromStorage();
                                    }
                                },
                            }}
                        >
                            Deleted habit
                        </Snackbar>
                    </Portal>
                ),
                [justDeleted]
            )}
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: {
        padding: 5,
        paddingBottom: 0,
    },
    list: {
        gap: 10,
        paddingBottom: 50,
        paddingHorizontal: 10,
    },
});
