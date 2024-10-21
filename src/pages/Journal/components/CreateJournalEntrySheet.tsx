import BottomSheet from '../../../components/BottomSheet';
import HeaderText from '../../../components/HeaderText';
import { JournalEntryType } from '../Types';

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
    return (
        <BottomSheet
            open={open}
            setOpen={setOpen}
        >
            <HeaderText>New {TITLE_MAP[type]} entry</HeaderText>
        </BottomSheet>
    );
}
