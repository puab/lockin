import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createTaskSlice, TaskSlice } from './task-slice';
import { createHabitSlice, HabitSlice } from './habit-slice';
import { createGoalSlice, GoalSlice } from './goal-slice';

type AppStore = {
    _hasHydrated: boolean;
    _setHasHydrated: (val: boolean) => void;
} & TaskSlice &
    HabitSlice &
    GoalSlice;

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
