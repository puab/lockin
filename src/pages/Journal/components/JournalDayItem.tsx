import { StyleSheet, View } from 'react-native';
import { JournalEntry } from '../Types';
import { Icon, Text } from 'react-native-paper';
import AppTheme from '../../../Theme';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type JournalDayItemProps = {
    data: JournalEntry;
    onPress: (x: number, y: number) => void;
};

export default function JournalDayItem({ data, onPress }: JournalDayItemProps) {
    const tap = Gesture.Tap()
        .runOnJS(true)
        .onStart(e => onPress(e.absoluteX, e.absoluteY));

    return (
        <View style={S.container}>
            <GestureDetector gesture={tap}>
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
            </GestureDetector>

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
