import { ScrollView, StyleSheet, View } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { Button, Portal, Snackbar, Text } from 'react-native-paper';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import HabitItem from './components/HabitItem';
import { Habit } from './Types';
import LS from '../../LocalStorage';
import { DateNowStr } from '../../Util';
import EditDialog from './components/EditDialog';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';

export default function HabitScreen({ navigation }) {
    const habits = useAppStore(s => s.habits);
    const addCompletionToHabit = useAppStore(
        useShallow(s => s.addCompletionToHabit)
    );
    const deleteHabit = useAppStore(useShallow(s => s.deleteHabit));
    const populateFakeCompletion = useAppStore(
        useShallow(s => s.populateFakeCompletion)
    );
    const addHabit = useAppStore(useShallow(s => s.addHabit));

    function wantsCompletion(habit: Habit) {
        addCompletionToHabit(habit);
    }

    const [justDeleted, setJustDeleted] = useState<boolean>(false);
    const deleteTargetRef = useRef<Habit | null>(null);
    function wantsDelete(habit: Habit) {
        deleteTargetRef.current = habit;
        deleteHabit(habit);
        setJustDeleted(true);
    }

    const [isEditing, setEditing] = useState<boolean>(false);
    const editTargetRef = useRef<Habit | null>(null);
    function wantsEdit(habit: Habit) {
        editTargetRef.current = habit;
        setEditing(true);
    }

    function wantsFakeData(habit: Habit) {
        populateFakeCompletion(habit, 100);
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
                                onPress: () => {
                                    if (deleteTargetRef.current) {
                                        addHabit(deleteTargetRef.current);
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
