import { useState } from 'react';
import AppTheme, { COLORS } from '../../../Theme';
import { Goal } from '../Types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Menu, RadioButton, Text } from 'react-native-paper';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../store';

type GoalItemProps = {
    goal: Goal;
    wantsEdit: () => void;
    wantsDelete: () => void;
};

export default function GoalItem({
    goal,
    wantsEdit,
    wantsDelete,
}: GoalItemProps) {
    const toggleGoalCompletion = useAppStore(
        useShallow(s => s.toggleGoalCompletion)
    );

    const goalHex = COLORS[goal.color];

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    function toggleCompletion() {
        toggleGoalCompletion(goal);
    }

    const headerLeft = (
        <View style={S.headerLeft}>
            <View style={S.iconContainer}>
                <Icon
                    source={goal.icon}
                    size={24}
                    color={goalHex}
                />
            </View>
            <View style={S.info}>
                <Text style={{ fontSize: 18 }}>{goal.name}</Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: 'rgb(175, 175, 175)',
                    }}
                    numberOfLines={3}
                >
                    {goal.reason}
                </Text>
            </View>
        </View>
    );

    const tap = Gesture.Tap()
        .runOnJS(true)
        .onStart(() => setMenuOpen(true));

    const el = (
        <View style={[S.container, { borderColor: goalHex }]}>
            <View style={S.header}>
                <GestureDetector gesture={tap}>{headerLeft}</GestureDetector>

                <RadioButton
                    value={goal.id}
                    status={goal.completed ? 'checked' : 'unchecked'}
                    color={goalHex}
                    uncheckedColor={goalHex}
                    onPress={toggleCompletion}
                />
            </View>
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

const S = StyleSheet.create({
    container: {
        gap: 5,
        padding: 5,
        borderLeftWidth: 3,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        flexShrink: 1,
        flexGrow: 1,
    },
    iconContainer: {
        padding: 5,
    },
    info: {
        justifyContent: 'center',
    },
});
