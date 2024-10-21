import AddItemButton from '../../components/AddItemButton';
import PageLayout from '../../components/PageLayout';
import { Menu, Text } from 'react-native-paper';
import JournalList from './components/JournalList';
import { useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import { JournalEntryType } from './Types';
import CreateJournalEntrySheet from './components/CreateJournalEntrySheet';

export default function JournalScreen() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [createJournalSheetOpen, setCreateJournalSheetOpen] =
        useState<boolean>(false);
    const [createJournalType, setCreateJournalType] =
        useState<JournalEntryType>('note');

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
        <PageLayout>
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

            <JournalList />
        </PageLayout>
    );
}
