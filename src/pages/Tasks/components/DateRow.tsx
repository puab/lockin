import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DateNow } from '../../../Util';
import { Text } from 'react-native-paper';
import AppTheme from '../../../Theme';

type DateRowProps = {
    selected: DateTime;
    onChange: (dateStr: string) => void;
};

export default function DateRow({ selected, onChange }: DateRowProps) {
    const dates = useMemo(() => {
        const start = DateTime.now().minus({ days: 1 });

        const ret: string[] = [];

        for (let i = 0; i <= 100; i++) {
            const d = start.plus({ days: i });
            ret.push(d.toFormat('yyyy-LL-dd'));
        }

        return ret;
    }, []);

    return (
        <View>
            <FlatList
                data={dates}
                horizontal
                keyExtractor={item => item}
                renderItem={({ item, index }) => (
                    <DateCell
                        first={index === 0}
                        last={index === dates.length - 1}
                        dateStr={item}
                        active={selected.toFormat('yyyy-LL-dd') == item}
                        onPress={() => onChange(item)}
                    />
                )}
            />
        </View>
    );
}

const row = StyleSheet.create({});

type DateCellProps = {
    first: boolean;
    last: boolean;
    dateStr: string;
    active?: boolean;
    onPress?: () => void;
};

function DateCell({ first, last, dateStr, active, onPress }: DateCellProps) {
    const today = dateStr === DateNow.toFormat('yyyy-LL-dd');

    const date = DateTime.fromFormat(dateStr, 'yyyy-LL-dd');

    return (
        <TouchableOpacity
            style={[
                cell.container,
                active ? cell.active : cell.inactive,
                today && cell.today,
                first && cell.first,
                last && cell.last,
            ]}
            onPress={onPress}
        >
            <Text>{date.toFormat('ccc')}</Text>
            <Text style={cell.number}>{date.toFormat('dd')}</Text>
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
        marginBottom: 5,
        marginRight: 5,
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
    first: {
        marginLeft: 50,
    },
    last: {
        marginRight: 50,
    },
});
