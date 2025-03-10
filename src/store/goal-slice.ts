import { StateCreator } from 'zustand';
import { Goal, GoalStep } from '../pages/Goals/Types';
import { DateTime } from 'luxon';

export type GoalSlice = {
    goals: Goal[];
    deleteGoal: (goal: Goal) => void;
    createGoal: (newGoal: Goal) => void;
    updateGoal: (updatedGoal: Goal) => void;
    overwriteGoals: (newGoals: Goal[]) => void;
    toggleGoalCompletion: (goal: Goal) => void;
    toggleGoalStepCompletion: (goalStep: GoalStep, dateStr: string) => void;
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
    createGoal: newGoal => {
        set(state => ({
            goals: [
                {
                    ...newGoal,
                    createdAt: DateTime.now().toMillis(),
                    updatedAt: DateTime.now().toMillis(),
                },
                ...state.goals,
            ],
        }));
    },
    updateGoal: updatedGoal => {
        set(state => ({
            goals: state.goals.map(g =>
                g.id === updatedGoal.id ? updatedGoal : g
            ),
        }));
    },
    overwriteGoals: newGoals => {
        set({ goals: newGoals });
    },
    toggleGoalCompletion: goal => {
        set(state => ({
            goals: state.goals.map(g =>
                g.id === goal.id
                    ? {
                          ...g,
                          completed: !g.completed,
                          updatedAt: DateTime.now().toMillis(),
                      }
                    : g
            ),
        }));
    },
    toggleGoalStepCompletion: (goalStep, dateStr) => {
        set(state => {
            return {
                ...state,
                goals: state.goals.map(g => ({
                    ...g,
                    steps: g.steps.map(s => {
                        if (s.id === goalStep.id) {
                            const completedDates = s.completedDates ?? [];

                            return {
                                ...s,
                                completedDates: completedDates.includes(dateStr)
                                    ? completedDates.filter(d => d !== dateStr)
                                    : [...completedDates, dateStr],
                            };
                        }

                        return s;
                    }),
                })),
            };
        });
    },
});
