import { StyleSheet, View } from 'react-native';
import { JournalEntry } from '../Types';
import { Icon, Text } from 'react-native-paper';
import AppTheme from '../../../Theme';

type JournalDayItemProps = {
    data: JournalEntry;
};

export default function JournalDayItem({ data }: JournalDayItemProps) {
    return (
        <View style={S.container}>
            <View style={S.header}>
                {data.type == 'note' && (
                    <Text
                        style={[
                            S.headerText,
                            { color: AppTheme.colors.primary },
                        ]}
                    >
                        Note
                    </Text>
                )}

                {data.type == 'gratefulness' && (
                    <Text style={S.headerText}>
                        I am{' '}
                        <Text
                            style={[
                                S.headerText,
                                { color: AppTheme.colors.primary },
                            ]}
                        >
                            grateful
                        </Text>{' '}
                        for...
                    </Text>
                )}

                {data.type == 'wins' && (
                    <Text style={S.headerText}>
                        Today's{' '}
                        <Text
                            style={[
                                S.headerText,
                                { color: AppTheme.colors.primary },
                            ]}
                        >
                            wins
                        </Text>
                    </Text>
                )}

                <Icon
                    source={
                        data.type === 'note'
                            ? 'note'
                            : data.type === 'gratefulness'
                            ? 'heart'
                            : 'trophy'
                    }
                    size={18}
                    color={AppTheme.colors.primary}
                />
            </View>

            {Array.isArray(data.content) ? (
                data.content.map((item, idx) => (
                    <View
                        style={S.item}
                        key={`jdii${idx}`}
                    >
                        <Text>{item}</Text>
                    </View>
                ))
            ) : (
                <Text style={S.item}>{data.content}</Text>
            )}
        </View>
    );
}

const S = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
    },

    container: {
        padding: 5,
        backgroundColor: 'black',
        borderRadius: 5,
        gap: 5,
    },

    item: {
        padding: 5,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 5,
    },
});
