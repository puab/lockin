import { StyleSheet, View } from 'react-native';
import { JournalEntry } from '../Types';
import { Text } from 'react-native-paper';
import AppTheme from '../../../Theme';
import { LinearGradient } from 'expo-linear-gradient';
import JournalDayItem from './JournalDayItem';

type JournalDayProps = {
    dateStr: string;
    entries: JournalEntry[];
    onEntryPress: (entry: JournalEntry, x: number, y: number) => void;
};

export default function JournalDay({
    dateStr,
    entries,
    onEntryPress,
}: JournalDayProps) {
    const [year, month, day] = dateStr.split('-');

    dateStr = `${day}.${month}.${year}`;

    return (
        <View style={S.container}>
            <View style={S.header}>
                <LinearGradient
                    style={S.headerDivideLine}
                    colors={['transparent', AppTheme.colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                ></LinearGradient>

                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                    {dateStr}
                </Text>

                <LinearGradient
                    style={S.headerDivideLine}
                    colors={[AppTheme.colors.primary, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                ></LinearGradient>
            </View>
            <View style={S.content}>
                {entries.map((entry, idx) => (
                    <JournalDayItem
                        key={`jdi${idx}`}
                        data={entry}
                        onPress={(x, y) => onEntryPress(entry, x, y)}
                    />
                ))}
            </View>
        </View>
    );
}

const S = StyleSheet.create({
    container: {
        gap: 5,
    },
    header: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    headerDivideLine: {
        flex: 1,
        height: 1,
    },

    content: {
        gap: 5,
    },
});
