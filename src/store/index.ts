import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createTaskSlice, TaskSlice } from './task-slice';
import { createHabitSlice, HabitSlice } from './habit-slice';
import { createGoalSlice, GoalSlice } from './goal-slice';
import { createJournalSlice, JournalSlice } from './journal-slice';

type AppStore = {
    _hasHydrated: boolean;
    _setHasHydrated: (val: boolean) => void;
} & TaskSlice &
    HabitSlice &
    GoalSlice &
    JournalSlice;

export const useAppStore = create<AppStore>()(
    persist(
        (...a) => ({
            _hasHydrated: false,
            _setHasHydrated: val => {
                a[0](state => ({ _hasHydrated: val }));
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
