import { StyleSheet, useWindowDimensions, View } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { Button, Text } from 'react-native-paper';
import { useMemo, useRef, useState } from 'react';
import useSheetBack from '../../hooks/useSheetBack';
import CreateOrUpdateGoalSheet from './components/CreateOrUpdateGoalSheet';
import useHeaderRight from '../../hooks/useHeaderRight';
import { Goal } from './Types';
import { useAppStore } from '../../store';
import GoalList from './components/GoalList';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AppTheme from '../../Theme';
import { useShallow } from 'zustand/react/shallow';

export default function GoalsScreen() {
    const goals = useAppStore<Goal[]>(s => s.goals);

    const deleteGoal = useAppStore(useShallow(s => s.deleteGoal));

    const [goalSheetOpen, setGoalSheetOpen] = useState<boolean>(false);
    useSheetBack(goalSheetOpen, setGoalSheetOpen);

    const [justDeleted, setJustDeleted] = useState<boolean>(false);
    const deleteTargetRef = useRef<Goal | null>(null);
    function wantsDelete(goal: Goal) {
        deleteTargetRef.current = goal;
        deleteGoal(goal);
        setJustDeleted(true);
    }

    const editTargetRef = useRef<Goal | null>(null);
    function wantsEdit(goal: Goal) {
        editTargetRef.current = goal;
        setGoalSheetOpen(true);
    }

    function wantsCreate() {
        editTargetRef.current = null;
        setJustDeleted(false);
        setGoalSheetOpen(true);
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

    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);

    const [ongoingGoals, completedGoals] = useMemo(
        () => [
            <GoalList
                goals={goals.filter(g => !g.completed)}
                wantsCreate={wantsCreate}
                wantsEdit={wantsEdit}
                wantsDelete={wantsDelete}
                nonIdealTitle='No ongoing goals'
                nonIdealMessage='Create a goal to get started'
            />,
            <GoalList
                goals={goals.filter(g => g.completed)}
                wantsCreate={wantsCreate}
                wantsEdit={wantsEdit}
                wantsDelete={wantsDelete}
                nonIdealTitle='No completed goals'
                nonIdealMessage="And that's okay!"
            />,
        ],
        [goals]
    );

    return (
        <PageLayout style={S.page}>
            <TabView
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        style={{
                            backgroundColor: AppTheme.colors.inverseOnSurface,
                        }}
                        indicatorStyle={{
                            backgroundColor: AppTheme.colors.primary,
                        }}
                        labelStyle={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                        }}
                    />
                )}
                navigationState={{
                    index,
                    routes: [
                        { key: 'ongoing', title: 'Ongoing' },
                        { key: 'completed', title: 'Completed' },
                    ],
                }}
                renderScene={({ route }) => {
                    switch (route.key) {
                        case 'ongoing':
                            return ongoingGoals;
                        case 'completed':
                            return completedGoals;
                    }
                }}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />

            <CreateOrUpdateGoalSheet
                open={goalSheetOpen}
                setOpen={setGoalSheetOpen}
                editTarget={editTargetRef.current}
            />
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: {
        paddingBottom: 0,
    },
});
