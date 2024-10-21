export type JournalEntryType = 'note' | 'gratefulness' | 'wins';

export type JournalEntry = {
    id: string;

    type: JournalEntryType;
    content: string;

    createdAtDateStr?: string;
    createdAt?: number;
};
