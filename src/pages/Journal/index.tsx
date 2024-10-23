import AddItemButton from '../../components/AddItemButton';
import PageLayout from '../../components/PageLayout';
import { Menu } from 'react-native-paper';
import JournalList from './components/JournalList';
import { useMemo, useState } from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import { JournalEntryType } from './Types';
import CreateJournalEntrySheet from './components/CreateJournalEntrySheet';
import useSheetBack from '../../hooks/useSheetBack';
import { useAppStore } from '../../store';

export default function JournalScreen() {
    const journals = useAppStore(state => state.journals);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [createJournalSheetOpen, setCreateJournalSheetOpen] =
        useState<boolean>(false);
    const [createJournalType, setCreateJournalType] =
        useState<JournalEntryType>('note');
    useSheetBack(createJournalSheetOpen, setCreateJournalSheetOpen);

    function wantsCreate(e: GestureResponderEvent) {
        setMenuPos({
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
        });
        setMenuOpen(true);
    }

    function startCreate(type: JournalEntryType) {
        setCreateJournalType(type);
        setCreateJournalSheetOpen(true);
        setMenuOpen(false);
    }

    return (
        <PageLayout style={S.page}>
            <Menu
                visible={menuOpen}
                onDismiss={() => setMenuOpen(false)}
                mode='elevated'
                anchorPosition='top'
                anchor={menuPos}
            >
                <Menu.Item
                    onPress={() => startCreate('note')}
                    title='Note'
                    leadingIcon='note'
                />
                <Menu.Item
                    onPress={() => startCreate('gratefulness')}
                    title='Gratefulness'
                    leadingIcon='heart'
                />
                <Menu.Item
                    onPress={() => startCreate('wins')}
                    title='Wins'
                    leadingIcon='trophy'
                />
            </Menu>

            <AddItemButton onPress={wantsCreate} />

            <CreateJournalEntrySheet
                open={createJournalSheetOpen}
                setOpen={setCreateJournalSheetOpen}
                type={createJournalType}
            />

            {useMemo(
                () => (
                    <JournalList journals={journals} />
                ),
                [journals]
            )}
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: {
        padding: 10,
        paddingBottom: 0,
    },
});
