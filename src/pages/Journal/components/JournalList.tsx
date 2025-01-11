import { StyleSheet } from 'react-native';
import NonIdealState from '../../../components/NonIdealState';
import { JournalEntry } from '../Types';
import { ScrollView } from 'react-native-gesture-handler';
import { useMemo, useState } from 'react';
import JournalDay from './JournalDay';
import { Menu } from 'react-native-paper';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';

type JournalListProps = {
    journals: JournalEntry[];
};

export default function JournalList({ journals }: JournalListProps) {
    const [menuItem, setMenuItem] = useState<JournalEntry | null>(null);
    const [menuCoordinates, setMenuCoordinates] = useState<[number, number]>([
        0, 0,
    ]);

    function wantsMenu(entry: JournalEntry, x: number, y: number) {
        setMenuItem(entry);
        setMenuCoordinates([x, y]);
    }

    const deleteJournal = useAppStore(useShallow(s => s.deleteJournal));
    function handleDelete(entry: JournalEntry) {
        setMenuItem(null);
        deleteJournal(entry);
    }

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

                // if (journal.type === 'wins') {
                //     const existing = acc[
                //         journal.createdAtDateStr as string
                //     ].find(j => j.type === 'wins');
                //     if (existing) {
                //         existing.content = [
                //             ...journal.content,
                //             ...existing.content,
                //         ];
                //         return acc;
                //     }
                // }

                // if (journal.type === 'gratefulness') {
                //     const existing = acc[
                //         journal.createdAtDateStr as string
                //     ].find(j => j.type === 'gratefulness');
                //     if (existing) {
                //         existing.content = [
                //             ...journal.content,
                //             ...existing.content,
                //         ];
                //         return acc;
                //     }
                // }

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
                                onEntryPress={wantsMenu}
                            />
                        )
                    )}
                </ScrollView>
            )}

            <Menu
                visible={!!menuItem}
                onDismiss={() => setMenuItem(null)}
                mode='elevated'
                anchorPosition='bottom'
                anchor={{ x: menuCoordinates[0], y: menuCoordinates[1] }}
            >
                <Menu.Item
                    onPress={() => handleDelete(menuItem as JournalEntry)}
                    title='Delete'
                    leadingIcon='delete'
                    titleStyle={{ color: 'red' }}
                    theme={{ colors: { onSurfaceVariant: 'red' } }}
                />
            </Menu>
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
