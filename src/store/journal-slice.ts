import { StateCreator } from 'zustand';
import { JournalEntry } from '../pages/Journal/Types';
import { DateTime } from 'luxon';

export type JournalSlice = {
    journals: JournalEntry[];
    createJournal: (newJournal: JournalEntry) => void;
};

export const createJournalSlice: StateCreator<
    JournalSlice,
    [],
    [],
    JournalSlice
> = (set, get) => ({
    journals: [],
    createJournal: newJournal => {
        set(state => ({
            journals: [
                ...state.journals,
                {
                    ...newJournal,
                    createdAt: DateTime.now().toMillis(),
                    createdAtDateStr:
                        DateTime.now()
                        .toFormat('yyyy-LL-dd'),
                },
            ],
        }));
    },
});
