import { useState } from 'react';
import { Task } from '../Types';
import AppTheme, { COLORS } from '../../../Theme';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { Menu, RadioButton, Text } from 'react-native-paper';

type TaskEntryProps = {
    task: Task;
    wantsEdit: () => void;
    wantsDelete: () => void;
    wantsComplete: (x: number, y: number) => void;
};

export default function TaskEntry({
    task,
    wantsEdit,
    wantsDelete,
    wantsComplete,
}: TaskEntryProps) {
    const taskHex = COLORS[task.color];

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const doubleTap = Gesture.Tap()
        .runOnJS(true)
        .onStart(() => setMenuOpen(true));

    const el = (
        <View style={[entry.container, { borderLeftColor: taskHex }]}>
            <View style={entry.left}>
                <RadioButton
                    value={task.id}
                    status={task.completed ? 'checked' : 'unchecked'}
                    color={taskHex}
                    uncheckedColor={taskHex}
                    onPress={e =>
                        wantsComplete(e.nativeEvent.pageX, e.nativeEvent.pageY)
                    }
                />
            </View>

            <GestureDetector gesture={doubleTap}>
                <View style={entry.right}>
                    <Text style={entry.description}>{task.description}</Text>
                </View>
            </GestureDetector>
        </View>
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
        justifyContent: 'center',
        flex: 1,
    },
    description: {},
});
