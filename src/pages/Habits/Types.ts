export type Habit = {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    dailyGoal: number;
    completionMatrix: CompletionMatrix;
    createdAt: number;
    updatedAt: number;
};

export type CompletionMatrix = {
    [date: string]: number;
};
