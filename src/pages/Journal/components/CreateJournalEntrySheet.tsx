import { useEffect, useState } from 'react';
import BottomSheet from '../../../components/BottomSheet';
import FormTextField from '../../../components/FormTextField';
import HeaderText from '../../../components/HeaderText';
import { JournalEntry, JournalEntryType } from '../Types';
import EntryItemController from './EntryItemController';
import { Button, Divider, Text } from 'react-native-paper';
import useErrorStack from '../../../hooks/useErrorStack';
import { uuid } from '../../../Util';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';

const TITLE_MAP: Record<JournalEntryType, string> = {
    note: 'note',
    gratefulness: 'gratefulness',
    wins: 'win',
};

type CreateJournalEntrySheet = {
    open: boolean;
    setOpen: (open: boolean) => void;
    type: JournalEntryType;
};

export default function CreateJournalEntrySheet({
    open,
    setOpen,
    type,
}: CreateJournalEntrySheet) {
    const { validate, clear, errors } = useErrorStack();

    const [content, setContent] = useState<string>('');
    const [items, setItems] = useState<string[]>(['', '', '']);

    const createJournal = useAppStore(useShallow(s => s.createJournal));

    useEffect(() => {
        setItems(['', '', '']);
        setContent('');
    }, [type]);

    function handleCreate() {
        const entry: JournalEntry = {
            id: uuid(),
            type,
            content: type === 'note' ? content : items,
        };

        const validItems = items.filter((value, i) =>
            validate(`item_${i}`, !!value, 'Item cannot be empty')
        );

        const validContent = validate(
            'content',
            !!content,
            'Content cannot be empty'
        );

        const valid =
            type === 'note' ? validContent : validItems.length === items.length;

        if (valid) {
            createJournal(entry);
            setOpen(false);

            setTimeout(() => {
                setItems(['', '', '']);
                setContent('');
            }, 200);
        }
    }

    return (
        <BottomSheet
            open={open}
            setOpen={setOpen}
            onDismiss={clear}
        >
            {/* <View style={S.header}>
                <HeaderText>New {TITLE_MAP[type]} entry</HeaderText>

                <TouchableOpacity>
                    <Icon
                        source='information'
                        size={24}
                    />
                </TouchableOpacity>
            </View> */}

            <HeaderText>New {TITLE_MAP[type]} entry</HeaderText>

            {type === 'note' && (
                <Text>Write today's thoughts and feelings</Text>
            )}
            {type === 'gratefulness' && (
                <Text>Write a couple things you're grateful for today</Text>
            )}
            {type === 'wins' && (
                <Text>Write a couple wins you've had today</Text>
            )}

            {type === 'note' ? (
                <FormTextField
                    value={content}
                    onChange={setContent}
                    label='Write your note here...'
                    numberOfLines={7}
                    multiline
                    errors={errors.content}
                />
            ) : (
                <EntryItemController
                    value={items}
                    onChange={setItems}
                    errors={errors}
                />
            )}

            <Divider style={{ marginTop: 'auto' }} />

            <Button
                mode='contained'
                onPress={handleCreate}
                icon={'plus'}
            >
                Create
            </Button>
        </BottomSheet>
    );
}
