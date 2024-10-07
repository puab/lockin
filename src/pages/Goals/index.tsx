import { StyleSheet, View } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { Button, Text } from 'react-native-paper';
import { useMemo, useRef, useState } from 'react';
import useSheetBack from '../../hooks/useSheetBack';
import NewGoalSheet from './components/NewGoalSheet';
import useHeaderRight from '../../hooks/useHeaderRight';
import { Goal } from './Types';
import { useAppStore } from '../../store';
import GoalList from './components/GoalList';

export default function GoalsScreen() {
    const goals = useAppStore<Goal[]>(s => s.goals);

    const [newGoalSheetOpen, setNewGoalSheetOpen] = useState<boolean>(false);
    useSheetBack(newGoalSheetOpen, setNewGoalSheetOpen);

    const [justDeleted, setJustDeleted] = useState<boolean>(false);
    const deleteTargetRef = useRef<Goal | null>(null);
    function wantsDelete(goal: Goal) {
        deleteTargetRef.current = goal;
        // deleteHabit(habit);
        setJustDeleted(true);
    }

    function wantsCreate() {
        setJustDeleted(false);
        setNewGoalSheetOpen(true);
    }

    useHeaderRight(
        goals.length !== 0 ? (
            <Button
                style={{ marginRight: 15 }}
                mode='elevated'
                icon={'plus'}
                onPress={wantsCreate}
            >
                Create
            </Button>
        ) : null,
        [goals]
    );

    return (
        <PageLayout style={S.page}>
            {useMemo(
                () => (
                    <GoalList
                        goals={goals}
                        wantsCreate={wantsCreate}
                    />
                ),
                [goals]
            )}

            <NewGoalSheet
                open={newGoalSheetOpen}
                setOpen={setNewGoalSheetOpen}
            />
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: {
        padding: 5,
        paddingBottom: 0,
    },
});
