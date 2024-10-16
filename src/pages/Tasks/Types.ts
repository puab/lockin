export type Task = {
    id: string;
    date: string;
    description: string;
    completed: boolean;
    color: string;

    remindMe: boolean;
    remindType?: 'morning-of' | 'evening-before';
    notificationId?: string;

    createdAt?: number;
    updatedAt?: number;
};
