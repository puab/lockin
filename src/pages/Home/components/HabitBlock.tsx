import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppTheme, { COLORS } from '../../../Theme';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import { Habit } from '../../Habits/Types';
import { DateNowStr } from '../../../Util';
import { Icon, Text } from 'react-native-paper';
import { useMemo } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

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

    return useMemo(
        () => (
            <View style={S.container}>
                <TouchableOpacity onPress={goToHabits}>
                    <View style={S.header}>
                        <Text style={S.headerText}>Habits</Text>

                        <Icon
                            source={'menu-right'}
                            size={36}
                            color={AppTheme.colors.primary}
                        />
                    </View>
                </TouchableOpacity>

                {habits.length !== 0 && (
                    <ScrollView
                        contentContainerStyle={{ gap: 5 }}
                        style={{ maxHeight: 150 }}
                    >
                        {habits.map(h => (
                            <HabitButton
                                key={`cp${h.id}`}
                                habit={h}
                                wantsCompletion={() => wantsCompletion(h)}
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
        ),
        [habits]
    );
}

const S = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 10,
        gap: 5,
        maxHeight: 250,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: AppTheme.colors.primary,
    },

    noHabitText: {
        color: AppTheme.colors.primary,
        fontSize: 18,
        marginRight: 'auto',
        paddingLeft: 10,
    },
});

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
        <TouchableOpacity
            onPress={handlePress}
            disabled={countToday == habit.dailyGoal}
        >
            <LinearGradient
                colors={[COLORS[habit.color] + '4B', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[HB.container]}
            >
                <View
                    style={{
                        backgroundColor: AppTheme.colors.inverseOnSurface,
                        borderRadius: 500,
                    }}
                >
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
                </View>

                <View style={HB.right}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}
                        numberOfLines={1}
                    >
                        {habit.name}
                    </Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const HB = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 5,
        gap: 5,
        borderRadius: 10,
    },
    right: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 5,
    },
});
