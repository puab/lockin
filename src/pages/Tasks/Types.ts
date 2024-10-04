export type Task = {
    id: string;
    date: string;
    description: string;
    completed: boolean;
    color: string;
    createdAt?: number;
    updatedAt?: number;
};
