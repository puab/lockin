import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../../contexts/AppContext';
import Block from './Block';
import AppTheme, { COLORS } from '../../../Theme';
import CircularProgress, {
    CircularProgressBase,
} from 'react-native-circular-progress-indicator';
import { Scroll } from 'lucide-react-native';
import { Habit } from '../../Habits/Types';
import { DateNowStr } from '../../../Util';
import { Icon, Text } from 'react-native-paper';
import { useEffect, useMemo, useState } from 'react';
import LS from '../../../LocalStorage';

export default function HabitBlock() {
    const habits = useAppContext<Habit[]>(s => s.habits);

    return (
        <>
            {useMemo(
                () => (
                    <View style={S.container}>
                        {habits.map(h => (
                            <HabitButton
                                key={`cp${h.id}`}
                                habit={h}
                            />
                        ))}
                    </View>
                ),
                [habits]
            )}
        </>
    );
}

type HabitButtonProps = {
    habit: Habit;
};

function HabitButton({ habit }: HabitButtonProps) {
    const reloadHabitsFromStorage = useAppContext(
        s => s.reloadHabitsFromStorage
    );

    const [countToday, setCountToday] = useState<number>(
        habit.completionMatrix[DateNowStr] ?? 0
    );

    useEffect(() => {
        setCountToday(habit.completionMatrix[DateNowStr] ?? 0);
    }, [habit.completionMatrix[DateNowStr]]);

    async function wantsCompletion() {
        if (habit.completionMatrix[DateNowStr] === habit.dailyGoal) return;

        setCountToday(c => c + 1);
        await LS.habits.addCompletionToHabit(habit);
        await reloadHabitsFromStorage();
    }

    return (
        <TouchableOpacity onPress={wantsCompletion}>
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
        padding: 10,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 5,
    },

    piecesScrollView: {
        flexGrow: 0,
        flexShrink: 0,
    },
    piece: {
        padding: 5,
    },
});
