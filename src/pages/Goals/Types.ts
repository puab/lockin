export type GoalStep = {
    id: string;
    name: string;
    description?: string;
    completed: boolean;

    // false  - never
    // true   - daily
    // [1, 3] - monday, wednesday
    repeat: false | true | number[];
    showInTaskList?: boolean;
    completedDates?: string[]; // yyyy-LL-dd
};

export type GoalStepTask = GoalStep & {
    goalColor: string;
    goalName: string;
    goalId: string;
};

export type Goal = {
    id: string;

    name: string;
    reason: string;

    color: string;
    icon: string;

    steps: GoalStep[];
    completed: boolean;
    endAt?: number;

    createdAt?: number;
    updatedAt?: number;
};
