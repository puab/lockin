import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './data/tasks';
import appReducer from './data/app';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        app: appReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
