import { StateCreator } from 'zustand';
import { Goal } from '../pages/Goals/Types';

export type GoalSlice = {
    goals: Goal[];
    deleteGoal: (goal: Goal) => void;
    overwriteGoals: (newGoals: Goal[]) => void;
};

export const createGoalSlice: StateCreator<GoalSlice, [], [], GoalSlice> = (
    set,
    get
) => ({
    goals: [],
    deleteGoal: goal => {
        set(state => ({
            goals: state.goals.filter(h => h.id != goal.id),
        }));
    },
    overwriteGoals: newGoals => {
        set({ goals: newGoals });
    },
});
