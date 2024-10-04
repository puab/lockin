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
};

export default function TaskList({
    tasks,
    active,
    wantsEdit,
    wantsDelete,
}: TaskListProps) {
    const overwriteTasks = useAppStore(useShallow(s => s.overwriteTasks));

    const activeDateStr = active.toFormat('yyyy-LL-dd');

    const displayTasks = tasks.filter(t => t.date === activeDateStr);

    const renderItem = ({ item, drag }) => {
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

    return (
        <View style={list.container}>
            {displayTasks?.length === 0 ? (
                <NonIdealState
                    icon='calendar-question'
                    title={`No tasks today`}
                    message='Add a new task by clicking the + button below'
                />
            ) : (
                <DraggableFlatList
                    data={displayTasks}
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
