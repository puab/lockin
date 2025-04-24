import { StyleSheet } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { Button, Portal, Snackbar } from 'react-native-paper';
import { useMemo, useRef, useState } from 'react';
import { Habit } from './Types';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import HabitList from './components/HabitList';
import CreateOrUpdateHabitSheet from './components/CreateOrUpdateHabitSheet';
import useSheetBack from '../../hooks/useSheetBack';
import useHeaderRight from '../../hooks/useHeaderRight';

export default function HabitScreen({ navigation }) {
    const habits = useAppStore(s => s.habits);

    const [habitSheetOpen, setHabitSheetOpen] = useState<boolean>(false);
    useSheetBack(habitSheetOpen, setHabitSheetOpen);

    const addCompletionToHabit = useAppStore(
        useShallow(s => s.addCompletionToHabit)
    );
    const deleteHabit = useAppStore(useShallow(s => s.deleteHabit));
    const populateFakeCompletion = useAppStore(
        useShallow(s => s.populateFakeCompletion)
    );
    const createHabit = useAppStore(useShallow(s => s.createHabit));

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

    const editTargetRef = useRef<Habit | null>(null);
    function wantsEdit(habit: Habit) {
        editTargetRef.current = habit;
        setHabitSheetOpen(true);
    }

    function wantsFakeData(habit: Habit) {
        populateFakeCompletion(habit, 100);
    }

    function wantsCreate() {
        editTargetRef.current = null;
        setJustDeleted(false);
        setHabitSheetOpen(true);
    }

    useHeaderRight(
        <Button
            style={{ marginRight: 15 }}
            mode='elevated'
            icon={'plus'}
            onPress={wantsCreate}
        >
            Create
        </Button>,
        [habits]
    );

    return (
        <PageLayout style={S.page}>
            {useMemo(
                () => (
                    <HabitList
                        habits={habits}
                        wantsCompletion={wantsCompletion}
                        wantsDelete={wantsDelete}
                        wantsEdit={wantsEdit}
                        wantsFakeData={wantsFakeData}
                        wantsCreate={wantsCreate}
                    />
                ),
                [habits]
            )}

            {useMemo(
                () => (
                    <CreateOrUpdateHabitSheet
                        open={habitSheetOpen}
                        setOpen={setHabitSheetOpen}
                        editTarget={editTargetRef.current}
                    />
                ),
                [habitSheetOpen]
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
                                        createHabit(deleteTargetRef.current);
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
});
