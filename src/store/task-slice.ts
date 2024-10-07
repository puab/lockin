import { StateCreator } from 'zustand';
import { Task } from '../pages/Tasks/Types';
import { DateTime } from 'luxon';

export type TaskSlice = {
    tasks: Task[];
    clearOldTasks: () => void;
    addTask: (task: Task) => void;
    deleteTask: (task: Task) => void;
    toggleTaskCompletion: (task: Task) => void;
    updateTask: (task: Task) => void;
    overwriteTasks: (newTasks: Task[]) => void;
};

export const createTaskSlice: StateCreator<TaskSlice, [], [], TaskSlice> = (
    set,
    get
) => ({
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
});
