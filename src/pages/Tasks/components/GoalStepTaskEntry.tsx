import { useState } from 'react';
import AppTheme, { COLORS } from '../../../Theme';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { Menu, RadioButton, Text } from 'react-native-paper';
import { GoalStepTask } from '../../Goals/Types';

type GoalStepTaskEntryProps = {
    step: GoalStepTask;
    activeDateStr: string;
    wantsSeeGoal: () => void;
    wantsComplete: (x: number, y: number) => void;
};

export default function GoalStepTaskEntry({
    step,
    activeDateStr,
    wantsSeeGoal,
    wantsComplete,
}: GoalStepTaskEntryProps) {
    const goalHex = COLORS[step.goalColor];

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const doubleTap = Gesture.Tap()
        .runOnJS(true)
        .onStart(() => setMenuOpen(true));

    const el = (
        <View style={[entry.container, { borderLeftColor: goalHex }]}>
            <View style={entry.left}>
                <RadioButton
                    value={step.id}
                    status={
                        step.completedDates?.includes(activeDateStr)
                            ? 'checked'
                            : 'unchecked'
                    }
                    color={goalHex}
                    uncheckedColor={goalHex}
                    onPress={e =>
                        wantsComplete(
                            e.nativeEvent.pageX,
                            e.nativeEvent.pageY - 50
                        )
                    }
                />
            </View>

            <GestureDetector gesture={doubleTap}>
                <View style={entry.right}>
                    {step.goalName && (
                        <Text style={{ color: goalHex, fontSize: 10 }}>
                            {step.goalName}
                        </Text>
                    )}

                    <Text style={entry.description}>{step.name}</Text>
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
                    wantsSeeGoal();
                }}
                title='Go to goal'
                leadingIcon='flag-checkered'
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
