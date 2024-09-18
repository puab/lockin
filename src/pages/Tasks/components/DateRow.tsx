import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import API from '../../../API';
import { DateNow } from '../../../Util';
import { Text } from 'react-native-paper';
import AppTheme from '../../../Theme';

type DateRowProps = {
    selected: DateTime;
    onChange: (dt: DateTime) => void;
};

export default function DateRow({ selected, onChange }: DateRowProps) {
    const dates = useMemo(() => {
        const start = DateTime.now().minus({ days: 1 });

        const ret: DateTime[] = [];

        for (let i = 0; i <= 100; i++) {
            const d = start.plus({ days: i });
            ret.push(d);
        }

        return ret;
    }, []);

    return (
        <ScrollView
            style={row.scrollView}
            horizontal
        >
            <View style={row.row}>
                {dates.map(d => (
                    <DateCell
                        key={`dc-${d.toMillis()}`}
                        date={d}
                        active={
                            selected.toFormat('yyyy-LL-dd') ==
                            d.toFormat('yyyy-LL-dd')
                        }
                        onPress={() => onChange(d)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const row = StyleSheet.create({
    scrollView: {
        flexGrow: 0,
        flexShrink: 0,
        paddingLeft: 20,
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        gap: 5,
        paddingRight: 30,
    },
});

type DateCellProps = {
    date: DateTime;
    active?: boolean;
    onPress?: () => void;
};

function DateCell({ date, active, onPress }: DateCellProps) {
    const today =
        date.toFormat('yyyy-LL-dd') === DateNow.toFormat('yyyy-LL-dd');

    return (
        <TouchableOpacity
            style={[
                cell.container,
                active ? cell.active : cell.inactive,
                today && cell.today,
            ]}
            onPress={onPress}
        >
            <>
                <Text>{date.toFormat('ccc')}</Text>
                <Text style={cell.number}>{date.toFormat('dd')}</Text>
            </>
        </TouchableOpacity>
    );
}

const cell = StyleSheet.create({
    container: {
        gap: 3,
        alignItems: 'center',
        borderRadius: 5,
        width: 40,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    active: {
        backgroundColor: AppTheme.colors.inversePrimary,
    },
    inactive: {
        backgroundColor: AppTheme.colors.onPrimary,
    },
    number: {
        fontWeight: 'bold',
    },
    today: {
        borderColor: AppTheme.colors.primary,
    },
});
