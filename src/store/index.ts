import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from '../pages/Tasks/Types';
import { Habit } from '../pages/Habits/Types';
import { DateTime } from 'luxon';

type AppStore = {
    _hasHydrated: boolean;
    _setHasHydrated: (val: boolean) => void;

    tasks: Task[];
    clearOldTasks: () => void;
    addTask: (task: Task) => void;
    deleteTask: (task: Task) => void;
    toggleTaskCompletion: (task: Task) => void;
    updateTask: (task: Task) => void;
    overwriteTasks: (newTasks: Task[]) => void;

    habits: Habit[];
    addHabit: (habit: Habit) => void;
    deleteHabit: (habit: Habit) => void;
    updateHabit: (habit: Habit) => void;
    addCompletionToHabit: (habit: Habit, dayStr?: string) => void;
    populateFakeCompletion: (habit: Habit, days: number) => void;
    overwriteHabits: (newHabits: Habit[]) => void;
};

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            _hasHydrated: false,
            _setHasHydrated: val => {
                set(state => ({ _hasHydrated: val }));
            },

            // === TASKS === \\

            tasks: [],
            clearOldTasks: () => {
                set(state => ({
                    tasks: state.tasks.filter(t => {
                        const ageDays = DateTime.now()
                            .set({
                                hour: 0,
                                minute: 0,
                                second: 0,
                                millisecond: 0,
                            })
                            .diff(
                                DateTime.fromFormat(t.date, 'yyyy-LL-dd'),
                                'days'
                            ).days;

                        return ageDays <= 1;
                    }),
                }));
            },
            addTask: newTask => {
                set(state => ({
                    tasks: [
                        {
                            ...newTask,
                            createdAt: DateTime.now().toMillis(),
                            updatedAt: DateTime.now().toMillis(),
                        },
                        ...state.tasks,
                    ],
                }));
            },
            deleteTask: task => {
                set(state => ({
                    tasks: state.tasks.filter(t => t.id != task.id),
                }));
            },
            updateTask: task => {
                set(state => ({
                    tasks: state.tasks.map(t => {
                        if (t.id === task.id)
                            return {
                                ...t,
                                ...task,
                                updatedAt: DateTime.now().toMillis(),
                            };

                        return t;
                    }),
                }));
            },
            toggleTaskCompletion: task => {
                set(state => ({
                    tasks: state.tasks.map(t => {
                        if (t.id === task.id) {
                            return { ...t, completed: !t.completed };
                        }

                        return t;
                    }),
                }));
            },
            overwriteTasks: newTasks => {
                set(() => ({ tasks: newTasks }));
            },

            // === HABITS === \\

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
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: state => ({
                tasks: state.tasks,
                habits: state.habits,
            }),
            onRehydrateStorage: state => {
                return () => {
                    state.clearOldTasks();
                    state._setHasHydrated(true);
                };
            },
        }
    )
);
