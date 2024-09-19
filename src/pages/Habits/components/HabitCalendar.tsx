import { StyleSheet, View } from 'react-native';
import { Habit } from '../Types';
import { COLORS } from '../../../Theme';
import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { habitDays } from '../../../Util';

type HabitCalendarProps = {
    habit: Habit;
};

export default function HabitCalendar({ habit }: HabitCalendarProps) {
    return (
        <View style={S.container}>
            {habitDays.map((dateStr, idx) => {
                const completionTimes = habit.completionMatrix[dateStr];

                let col = `rgb(75, 75, 75)`;

                return (
                    <View
                        key={`hci${idx}`}
                        style={[S.cell, { backgroundColor: col }]}
                    ></View>
                );
            })}
        </View>
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
