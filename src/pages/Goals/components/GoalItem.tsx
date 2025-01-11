import AppTheme, { COLORS } from '../../../Theme';
import { Goal } from '../Types';
import { StyleSheet, View } from 'react-native';
import { Icon, RadioButton, Text } from 'react-native-paper';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type GoalItemProps = {
    goal: Goal;
    wantsMenu: (x: number, y: number) => void;
    wantsComplete: (x: number, y: number) => void;
};

export default function GoalItem({
    goal,
    wantsMenu,
    wantsComplete,
}: GoalItemProps) {
    const goalHex = COLORS[goal.color];
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
        .onStart(e => wantsMenu(e.absoluteX, e.absoluteY));

    return (
        <View style={[S.container, { borderColor: goalHex }]}>
            <View style={S.header}>
                <GestureDetector gesture={tap}>{headerLeft}</GestureDetector>

                <RadioButton
                    value={goal.id}
                    status={goal.completed ? 'checked' : 'unchecked'}
                    color={goalHex}
                    uncheckedColor={goalHex}
                    onPress={e =>
                        wantsComplete(e.nativeEvent.pageX, e.nativeEvent.pageY)
                    }
                />
            </View>
        </View>
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
        alignItems: 'flex-start',
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
