type GoalStep = {
    name: string;
    description?: string;
    completed: boolean;

    // 2      - twice a day
    // [1, 3] - monday, wednesday
    repeat?: number | number[];
};

type Goal = {
    id: string;

    name: string;
    reason: string;

    steps: GoalStep[];
    completed: boolean;
    endAt?: number;

    createdAt: number;
    updatedAt: number;
};
