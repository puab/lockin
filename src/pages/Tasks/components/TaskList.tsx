import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Task } from '../Types';
import API from '../../../API';
import LoaderPlaceholder from '../../../components/LoaderPlaceholder';
import { Menu, overlay, RadioButton, Text } from 'react-native-paper';
import { useAppContext } from '../../../contexts/AppContext';
import { DateTime } from 'luxon';
import AppTheme, { COLORS } from '../../../Theme';
import LS from '../../../LocalStorage';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type TaskListProps = {
    active: DateTime;
    wantsEdit: (task: Task) => void;
    wantsDelete: (task: Task) => void;
};

export default function TaskList({
    active,
    wantsEdit,
    wantsDelete,
}: TaskListProps) {
    const tasks = useAppContext<Task[]>(s => s.tasks);

    const displayTasks = tasks.filter(
        t => t.date === active.toFormat('yyyy-LL-dd')
    );

    return (
        <ScrollView style={list.scrollView}>
            <View style={list.container}>
                {displayTasks?.length === 0 ? (
                    <Text style={{ marginHorizontal: 'auto' }}>
                        No tasks this day
                    </Text>
                ) : (
                    displayTasks.map(t => {
                        return (
                            <TaskEntry
                                key={`te${t.id}`}
                                task={t}
                                onEdit={wantsEdit}
                                onDelete={wantsDelete}
                            />
                        );
                    })
                )}
            </View>
        </ScrollView>
    );
}

const list = StyleSheet.create({
    scrollView: {
        // backgroundColor: 'red',
        paddingHorizontal: 10,
    },
    container: {
        gap: 10,
        paddingTop: 5,
        paddingBottom: 50,
    },
});

type TaskEntryProps = {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
};

function TaskEntry({ task, onEdit, onDelete }: TaskEntryProps) {
    const taskHex = COLORS[task.color];
    const reloadTasksFromStorage = useAppContext(s => s.reloadTasksFromStorage);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [innerCompleted, setInnerCompleted] = useState<boolean>(
        task.completed
    );

    async function toggleTask() {
        setInnerCompleted(c => !c);
        await LS.toggleTask(task.id);
        await reloadTasksFromStorage();
    }

    const longPress = Gesture.LongPress()
        .runOnJS(true)
        .onStart(() => setMenuOpen(true));

    const el = (
        <GestureDetector gesture={longPress}>
            <View style={[entry.container, { borderLeftColor: taskHex }]}>
                <View style={entry.left}>
                    <RadioButton
                        value={task.id}
                        status={innerCompleted ? 'checked' : 'unchecked'}
                        color={taskHex}
                        uncheckedColor={taskHex}
                        onPress={toggleTask}
                    />
                </View>

                <View style={entry.right}>
                    <Text style={entry.description}>{task.description}</Text>
                </View>
            </View>
        </GestureDetector>
    );

    return (
        <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            mode='elevated'
            anchorPosition='bottom'
            anchor={el}
            style={{ marginLeft: 50 }}
        >
            <Menu.Item
                onPress={() => {
                    setMenuOpen(false);
                    onEdit(task);
                }}
                title='Edit'
                leadingIcon='pencil'
            />
            <Menu.Item
                onPress={() => {
                    setMenuOpen(false);
                    onDelete(task);
                }}
                title='Delete'
                leadingIcon='delete'
                titleStyle={{ color: 'red' }}
                theme={{ colors: { onSurfaceVariant: 'red' } }}
            />
        </Menu>
    );
}

const entry = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 5,
        borderLeftWidth: 3,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 5,
    },
    left: {},
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    description: {},
});
