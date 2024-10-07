import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Task } from '../Types';
import { Text } from 'react-native-paper';
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
    const overwriteTasks = useAppStore(useShallow(s => s.overwriteTasks));

    const activeDateStr = active.toFormat('yyyy-LL-dd');

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
                    />
                </TouchableWithoutFeedback>
            </ScaleDecorator>
        );
    };

    const displayTasks = tasks.filter(t => t.date === activeDateStr);

    return (
        <View style={list.container}>
            {displayTasks?.length === 0 ? (
                <NonIdealState
                    icon='calendar-question'
                    title={`No tasks today`}
                    message={
                        !currentlyInPast
                            ? `Add a new task by clicking the + button below`
                            : `You can't add tasks in the past`
                    }
                />
            ) : (
                <DraggableFlatList
                    data={tasks}
                    onDragEnd={({ data }) => overwriteTasks(data)}
                    renderItem={renderItem}
                    keyExtractor={item => `te${item.id}`}
                />
            )}
        </View>
    );
}

const list = StyleSheet.create({
    container: {
        paddingTop: 5,
        paddingBottom: 50,
    },
});
