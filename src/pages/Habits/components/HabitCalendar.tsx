import { StyleSheet, View } from 'react-native';
import { Habit } from '../Types';
import { COLORS } from '../../../Theme';
import { useMemo } from 'react';
import { habitDays } from '../../../Util';
import { ScrollView } from 'react-native-gesture-handler';

const baseCol = `rgb(75, 75, 75)`;

type HabitCalendarProps = {
    habit: Habit;
};

export default function HabitCalendar({ habit }: HabitCalendarProps) {
    // iegūst ieraduma izpildes matricu un celiņa krāsu
    const matrix = habit.completionMatrix;
    const hexCol = COLORS[habit.color];

    // ietveram visu useMemo, lai komponente pārzīmētos tikai tad, ja mainās "matrix" vai "hexCol"
    return useMemo(
        () => (
            // noliekam ScrollView, lai komponentē varētu tīt
            // pasakam "horizontal", lai tīšana notiktu pa labi un pa kreisi
            <ScrollView horizontal>
                {/* izveidojam galveno satura skatu, kur būs visi celiņi */}
                <View style={S.container}>
                    {/* par katru dienu, kas ir pēdējās 52 * 7 dienas (gads), izveidojam jaunu kvadrātu konteinerī */}
                    {habitDays.map((dateStr, idx) => {
                        // aprēķinām, cik procentu no dienas mērķa ir sasniegts
                        const percent =
                            (matrix[dateStr] ?? 0) / habit.dailyGoal;

                        // izveidojam celiņa krāsu, pamatojoties uz procentuālo daudzumu
                        const col =
                            percent == 0
                                ? baseCol
                                : hexCol +
                                  Math.floor(255 * percent).toString(16);

                        // izveidojam jaunu kvadrātu konteineri, kurā būs celiņa krāsa
                        return (
                            <View
                                key={`hci${idx}`}
                                style={[
                                    S.cell,
                                    {
                                        backgroundColor: col,
                                    },
                                ]}
                            ></View>
                        );
                    })}
                </View>
            </ScrollView>
        ),
        [habitDays, Object.values(matrix)]
    );
}

// statiskas konstantes kas nosaka celiņu izmēru un atstatumu starp tiem
const gap = 3;
const cellSize = 15;

// statisks stilu objekts, kas definē celiņu konteineri un to stilu
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
        borderRadius: 3,
    },
});
