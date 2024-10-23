import { StyleSheet } from 'react-native';
import NonIdealState from '../../../components/NonIdealState';
import { JournalEntry } from '../Types';
import { ScrollView } from 'react-native-gesture-handler';
import { useMemo } from 'react';
import JournalDay from './JournalDay';

type JournalListProps = {
    journals: JournalEntry[];
};

export default function JournalList({ journals }: JournalListProps) {
    const journalMap: { [dateStr: string]: JournalEntry[] } = useMemo(() => {
        const sorted = journals;
        sorted.sort(
            (a, b) => (b.createdAt as number) - (a.createdAt as number)
        );

        const map: { [dateStr: string]: JournalEntry[] } = sorted.reduce(
            (acc, journal) => {
                if (!acc[journal.createdAtDateStr as string]) {
                    acc[journal.createdAtDateStr as string] = [];
                }

                acc[journal.createdAtDateStr as string].push(journal);

                return acc;
            },
            {}
        );

        return map;
    }, [journals]);

    return (
        <>
            {journals.length === 0 ? (
                <NonIdealState
                    icon='notebook-multiple'
                    title='No journal entries'
                    message='Add a new journal entry by clicking the + button below'
                />
            ) : (
                <ScrollView
                    style={S.container}
                    contentContainerStyle={S.scrollContainer}
                >
                    {Object.entries(journalMap).map(
                        ([dateStr, entries], idx) => (
                            <JournalDay
                                key={`jd${idx}`}
                                dateStr={dateStr}
                                entries={entries}
                            />
                        )
                    )}
                </ScrollView>
            )}
        </>
    );
}

const S = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
    },
    scrollContainer: {
        paddingBottom: 50,
        gap: 10,
    },
});
