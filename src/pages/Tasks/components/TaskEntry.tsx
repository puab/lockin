import { useState } from 'react';
import { Task } from '../Types';
import AppTheme, { COLORS } from '../../../Theme';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { Menu, RadioButton, Text } from 'react-native-paper';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';

type TaskEntryProps = {
    task: Task;
    wantsEdit: () => void;
    wantsDelete: () => void;
};

export default function TaskEntry({
    task,
    wantsEdit,
    wantsDelete,
}: TaskEntryProps) {
    const toggleTaskCompletion = useAppStore(
        useShallow(s => s.toggleTaskCompletion)
    );

    const [expandedDesc, setExpandedDesc] = useState<boolean>(false);

    const taskHex = COLORS[task.color];

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    function toggleTask() {
        toggleTaskCompletion(task);
    }

    const doubleTap = Gesture.Tap()
        .runOnJS(true)
        .onStart(() => setMenuOpen(true));

    const el = (
        <GestureDetector gesture={doubleTap}>
            <View style={[entry.container, { borderLeftColor: taskHex }]}>
                <View style={entry.left}>
                    <RadioButton
                        value={task.id}
                        status={task.completed ? 'checked' : 'unchecked'}
                        color={taskHex}
                        uncheckedColor={taskHex}
                        onPress={toggleTask}
                    />
                </View>

                <View style={entry.right}>
                    {/* <TouchableOpacity
                        onLongPress={() => setExpandedDesc(e => !e)}
                    > */}
                    <Text
                        style={entry.description}
                        numberOfLines={!expandedDesc ? 3 : undefined}
                    >
                        {task.description}
                    </Text>
                    {/* </TouchableOpacity> */}
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
                    wantsEdit();
                }}
                title='Edit'
                leadingIcon='pencil'
            />
            <Menu.Item
                onPress={() => {
                    setMenuOpen(false);
                    wantsDelete();
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
        paddingVertical: 5,
        paddingRight: 5,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    left: {},
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    description: {},
});
