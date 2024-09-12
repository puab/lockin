import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import DateCell from './DateCell';

type DateRowProps = {
    selected: DateTime;
    onChange: (dt: DateTime) => void;
};

export default function DateRow({ selected, onChange }: DateRowProps) {
    const dates = useMemo(() => {
        const start = DateTime.now();

        const ret: DateTime[] = [];

        for (let i = 0; i <= 100; i++) {
            const d = start.plus({ days: i });
            ret.push(d);
        }

        return ret;
    }, []);

    return (
        <ScrollView
            style={S.scrollView}
            horizontal
        >
            <View style={S.row}>
                {dates.map(d => (
                    <DateCell
                        key={`dc-${d.toMillis()}`}
                        date={d}
                        active={
                            selected.toFormat('yyyy-LL-dd') ==
                            d.toFormat('yyyy-LL-dd')
                        }
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const S = StyleSheet.create({
    scrollView: {
        flexGrow: 0,
        paddingLeft: 20,
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        gap: 5,
    },
});
