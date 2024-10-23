export type JournalEntryType = 'note' | 'gratefulness' | 'wins';

export type JournalEntry = {
    id: string;

    type: JournalEntryType;
    content: string | string[];

    createdAtDateStr?: string;
    createdAt?: number;
};
