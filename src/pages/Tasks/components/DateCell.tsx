import { DateTime } from 'luxon';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { Text } from 'react-native-paper';
import AppTheme from '../../../Theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

type DateCellProps = {
    date: DateTime;
    active?: boolean;
    onPress?: () => void;
};

export default function DateCell({ date, active, onPress }: DateCellProps) {
    return (
        <TouchableOpacity
            style={[S.container, active ? S.active : S.inactive]}
            onPress={onPress}
        >
            <>
                <Text>{date.toFormat('ccc')}</Text>
                <Text style={S.number}>{date.toFormat('dd')}</Text>
            </>
        </TouchableOpacity>
    );
}

const S = StyleSheet.create({
    container: {
        gap: 3,
        alignItems: 'center',
        borderRadius: 5,
        width: 40,
        paddingVertical: 5,
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
});
