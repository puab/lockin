import { DateTime } from 'luxon';
import { Habit } from '../pages/Habits/Types';
import { StateCreator } from 'zustand';

export type HabitSlice = {
    habits: Habit[];
    addHabit: (habit: Habit) => void;
    deleteHabit: (habit: Habit) => void;
    updateHabit: (habit: Habit) => void;
    addCompletionToHabit: (habit: Habit, dayStr?: string) => void;
    populateFakeCompletion: (habit: Habit, days: number) => void;
    overwriteHabits: (newHabits: Habit[]) => void;
};

export const createHabitSlice: StateCreator<HabitSlice, [], [], HabitSlice> = (
    set,
    get
) => ({
    habits: [],
    addHabit: newHabit => {
        set(state => ({
            habits: [
                {
                    ...newHabit,
                    createdAt: DateTime.now().toMillis(),
                    updatedAt: DateTime.now().toMillis(),
                },
                ...state.habits,
            ],
        }));
    },
    deleteHabit: habit => {
        set(state => ({
            habits: state.habits.filter(h => h.id != habit.id),
        }));
    },
    updateHabit: habit => {
        set(state => ({
            habits: state.habits.map(h => {
                if (h.id === habit.id)
                    return {
                        ...h,
                        ...habit,
                        updatedAt: DateTime.now().toMillis(),
                    };

                return h;
            }),
        }));
    },
    addCompletionToHabit: (habit: Habit, dayStr: string = 'today') => {
        if (dayStr == 'today') {
            dayStr = DateTime.now().toFormat('yyyy-LL-dd');
        }

        const curHabits = get().habits;
        const newHabits = curHabits.map(h => {
            if (h.id === habit.id) {
                const matrix = {
                    ...h.completionMatrix,
                    [dayStr]: Math.min(
                        (h.completionMatrix[dayStr] || 0) + 1,
                        h.dailyGoal
                    ),
                };

                return {
                    ...h,
                    completionMatrix: matrix,
                };
            }

            return h;
        });

        set(() => ({ habits: newHabits }));
    },
    populateFakeCompletion: (habit: Habit, days: number) => {
        const start = DateTime.now();

        const dayStrs = [...new Array(days)].map((_, idx) => {
            return start.minus({ days: idx }).toFormat('yyyy-LL-dd');
        });

        const matrix = {};

        for (const str of dayStrs) {
            matrix[str] = Math.round(Math.random() * habit.dailyGoal);
        }

        const curHabits = get().habits;
        const newHabits = curHabits.map(h => {
            if (h.id === habit.id) {
                return { ...h, completionMatrix: matrix };
            }

            return h;
        });

        set(() => ({ habits: newHabits }));
    },
    overwriteHabits: newHabits => {
        set(() => ({ habits: newHabits }));
    },
});
