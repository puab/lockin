import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createTaskSlice, TaskSlice } from './task-slice';
import { createHabitSlice, HabitSlice } from './habit-slice';
import { createGoalSlice, GoalSlice } from './goal-slice';
import { createJournalSlice, JournalSlice } from './journal-slice';

type AppDataType = TaskSlice & HabitSlice & GoalSlice & JournalSlice;

export type SyncData = {
    tasks: TaskSlice['tasks'];
    habits: HabitSlice['habits'];
    goals: GoalSlice['goals'];
    journals: JournalSlice['journals'];
};

type AppStore = {
    _hasHydrated: boolean;
    _setHasHydrated: (val: boolean) => void;

    _importData: (data: SyncData) => void;
} & AppDataType;

export const useAppStore = create<AppStore>()(
    persist(
        (...a) => ({
            _hasHydrated: false,
            _setHasHydrated: val => {
                a[0](state => ({ _hasHydrated: val }));
            },

            _importData: data => {
                a[0](state => ({
                    tasks: data.tasks,
                    habits: data.habits,
                    goals: data.goals,
                    journals: data.journals,
                }));
            },

            ...createTaskSlice(...a),
            ...createHabitSlice(...a),
            ...createGoalSlice(...a),
            ...createJournalSlice(...a),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: state => ({
                tasks: state.tasks,
                habits: state.habits,
                goals: state.goals,
                journals: state.journals,
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
