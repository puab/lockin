import { StyleSheet, View } from 'react-native';
import { Task } from '../Types';
import { DateTime } from 'luxon';
import TaskEntry from './TaskEntry';
import DraggableFlatList, {
    ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import NonIdealState from '../../../components/NonIdealState';
import GoalStepTaskList from './GoalStepTaskList';
import { useMemo, useRef, useState } from 'react';
import { GoalStepTask } from '../../Goals/Types';
import { Divider } from 'react-native-paper';
import ConfettiBoom from '../../../components/ConfettiBoom';
import LottieView from 'lottie-react-native';
import { asyncVibrate } from '../../../Util';

type TaskListProps = {
    tasks: Task[];
    active: DateTime;
    wantsEdit: (task: Task) => void;
    wantsDelete: (task: Task) => void;
    currentlyInPast: boolean;
};

export default function TaskList({
    tasks,
    active,
    wantsEdit,
    wantsDelete,
    currentlyInPast,
}: TaskListProps) {
    const activeDateStr = active.toFormat('yyyy-LL-dd');

    const overwriteTasks = useAppStore(useShallow(s => s.overwriteTasks));
    const toggleTaskCompletion = useAppStore(
        useShallow(s => s.toggleTaskCompletion)
    );

    const animationRef = useRef<LottieView>(null);
    const [animationCoordinates, setAnimationCoordinates] = useState<
        [number, number]
    >([0, 0]);
    function handleComplete(item: Task, x: number, y: number) {
        if (!item.completed) {
            setAnimationCoordinates([x, y]);
            animationRef.current?.play();
            asyncVibrate();
        }
        toggleTaskCompletion(item);
    }

    const goals = useAppStore(s => s.goals);
    const goalStepsToday: GoalStepTask[] = useMemo(
        () =>
            goals
                .filter(g => !g.completed)
                .map(g =>
                    g.steps
                        .filter(s => {
                            if (!s.showInTaskList) return false;

                            if (s.repeat === false) return false;

                            if (Array.isArray(s.repeat))
                                return s.repeat.includes(active.weekday);

                            return true;
                        })
                        .map(s => ({
                            ...s,
                            goalColor: g.color,
                            goalName: g.name,
                            goalId: g.id,
                        }))
                )
                .flat(),
        [goals, activeDateStr]
    );

    const renderItem = ({ item, drag }) => {
        if (item.date !== activeDateStr) return null;

        return (
            <ScaleDecorator>
                <TouchableWithoutFeedback
                    onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        drag();
                    }}
                >
                    <TaskEntry
                        task={item}
                        wantsEdit={() => wantsEdit(item)}
                        wantsDelete={() => wantsDelete(item)}
                        wantsComplete={(x, y) => handleComplete(item, x, y)}
                    />
                </TouchableWithoutFeedback>
            </ScaleDecorator>
        );
    };

    const displayTasks = tasks.filter(t => t.date === activeDateStr);

    return (
        <>
            <View style={list.container}>
                {displayTasks?.length === 0 && goalStepsToday.length === 0 ? (
                    <NonIdealState
                        icon='calendar-question'
                        title={`No tasks today`}
                        message={
                            !currentlyInPast
                                ? `Add a new task by clicking the + button below or create a goal in the "Goals" section`
                                : `You can't add tasks in the past`
                        }
                    />
                ) : (
                    <>
                        <GoalStepTaskList
                            activeDate={active}
                            steps={goalStepsToday}
                        />

                        {goalStepsToday.length > 0 && (
                            <Divider
                                style={{ marginBottom: 5, marginTop: -5 }}
                            />
                        )}

                        <DraggableFlatList
                            data={tasks}
                            onDragEnd={({ data }) => overwriteTasks(data)}
                            renderItem={props => renderItem(props)}
                            keyExtractor={item => `te${item.id}`}
                        />
                    </>
                )}
            </View>

            <ConfettiBoom
                animRef={animationRef}
                coords={animationCoordinates}
            />
        </>
    );
}

const list = StyleSheet.create({
    container: {
        paddingTop: 5,
        paddingBottom: 50,
    },
});
