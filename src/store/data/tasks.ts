import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../pages/Tasks/Types';
import LS from '../../LocalStorage';

type TasksState = {
    tasks: Task[];
};

const initialState: TasksState = {
    tasks: [],
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(
            getTasks.fulfilled,
            (state, action: PayloadAction<Task[]>) => {
                state.tasks = action.payload;
            }
        );
    },
});

export const getTasks = createAsyncThunk('tasks/getTasks', async () => {
    const tasks = await LS.tasks.getTasks();
    return tasks;
});

export default tasksSlice.reducer;
