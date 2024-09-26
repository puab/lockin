import { StyleSheet, View } from 'react-native';
import { Habit } from '../Types';
import { COLORS } from '../../../Theme';
import { useMemo } from 'react';
import { DateNowStr, habitDays } from '../../../Util';

const baseCol = `rgb(75, 75, 75)`;

type HabitCalendarProps = {
    habit: Habit;
    completionCountToday: number;
};

export default function HabitCalendar({
    habit,
    completionCountToday,
}: HabitCalendarProps) {
    const matrix = habit.completionMatrix;
    const hexCol = COLORS[habit.color];

    return (
        <>
            {useMemo(
                () => (
                    <View style={S.container}>
                        {habitDays.map((dateStr, idx) => {
                            const today: boolean = dateStr === DateNowStr;

                            const percent =
                                (today
                                    ? completionCountToday
                                    : matrix[dateStr] ?? 0) / habit.dailyGoal;

                            const col =
                                percent == 0
                                    ? baseCol
                                    : hexCol +
                                      Math.floor(255 * percent).toString(16);

                            return (
                                <View
                                    key={`hci${idx}`}
                                    style={[
                                        S.cell,
                                        {
                                            backgroundColor: col,
                                        },
                                    ]}
                                >
                                    {/* <Text>{col}</Text> */}
                                </View>
                            );
                        })}
                    </View>
                ),
                [habitDays, matrix, completionCountToday]
            )}
        </>
    );
}

const gap = 3;
const cellSize = 10;

const S = StyleSheet.create({
    container: {
        height: cellSize * 7 + gap * 6,
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: gap,
    },
    cell: {
        height: cellSize,
        aspectRatio: '1 / 1',
        backgroundColor: 'black',
        borderRadius: 2,
    },
});
