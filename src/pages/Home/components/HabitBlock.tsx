import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../../contexts/AppContext';
import Block from './Block';
import AppTheme, { COLORS } from '../../../Theme';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import { Habit } from '../../Habits/Types';
import { DateNowStr } from '../../../Util';
import { Icon, Text } from 'react-native-paper';
import { useCallback, useMemo } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';

export default function HabitBlock() {
    const nav = useNavigation<NativeStackNavigationProp<any>>();

    function goToHabits() {
        nav.navigate('Habits');
    }

    const habits = useAppStore(s => s.habits);
    const addCompletionToHabit = useAppStore(
        useShallow(s => s.addCompletionToHabit)
    );

    function wantsCompletion(habit: Habit) {
        if (habit.completionMatrix[DateNowStr] === habit.dailyGoal) return;

        addCompletionToHabit(habit);
    }

    const Wrapper = useCallback(({ children }) => {
        if (habits.length !== 0)
            return <View style={S.container}>{children}</View>;

        return (
            <TouchableOpacity
                style={S.container}
                onPress={goToHabits}
            >
                {children}
            </TouchableOpacity>
        );
    }, []);

    return (
        <>
            {useMemo(
                () => (
                    <Wrapper>
                        {habits.length === 0 && (
                            <>
                                <Text style={S.noHabitText}>
                                    No habits created
                                </Text>
                                <Icon
                                    source={'menu-right'}
                                    size={48}
                                    color={AppTheme.colors.primary}
                                />
                            </>
                        )}

                        {habits.map(h => (
                            <HabitButton
                                key={`cp${h.id}`}
                                habit={h}
                                wantsCompletion={() => wantsCompletion(h)}
                            />
                        ))}
                    </Wrapper>
                ),
                [habits]
            )}
        </>
    );
}

type HabitButtonProps = {
    habit: Habit;
    wantsCompletion: () => void;
};

function HabitButton({ habit, wantsCompletion }: HabitButtonProps) {
    const countToday = habit.completionMatrix[DateNowStr] ?? 0;

    function handlePress() {
        wantsCompletion();
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <CircularProgressBase
                value={(countToday / habit.dailyGoal) * 100}
                maxValue={100}
                radius={20}
                activeStrokeWidth={5}
                inActiveStrokeWidth={5}
                duration={150}
                activeStrokeColor={COLORS[habit.color]}
            >
                <Icon
                    size={18}
                    source={habit.icon}
                    color={COLORS[habit.color]}
                />
            </CircularProgressBase>
            {/* <Text>{countToday?.toString()}</Text> */}
        </TouchableOpacity>
    );
}

const S = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 5,
    },

    noHabitText: {
        color: AppTheme.colors.primary,
        fontSize: 18,
        marginRight: 'auto',
        paddingLeft: 10,
    },

    piecesScrollView: {
        flexGrow: 0,
        flexShrink: 0,
    },
    piece: {
        padding: 5,
    },
});
