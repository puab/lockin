import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from './pages/Tasks/Types';
import { DateTime } from 'luxon';
import { Habit } from './pages/Habits/Types';

class Tasks {
    async getTasks(): Promise<Task[]> {
        try {
            const tasks = await AsyncStorage.getItem('tasks');
            if (tasks !== null) {
                return JSON.parse(tasks).sort(
                    (a: Task, b: Task) => a.createdAt - b.createdAt
                );
            }

            return [];
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async clearOldTasks(): Promise<void> {
        const treshold = DateTime.now().minus({ days: 2 }).toMillis();

        try {
            const curTasks = await this.getTasks();
            const newTasks = curTasks.filter(t => t.createdAt > treshold);

            const cleared = curTasks.length - newTasks.length;
            if (cleared > 0) {
                console.log(`[clearOldTasks]: ${cleared}`);
            }

            await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
        } catch (e) {
            console.error(e);
        }
    }

    async createTask(task: Task): Promise<void> {
        try {
            const curTasks = await this.getTasks();
            await AsyncStorage.setItem(
                'tasks',
                JSON.stringify([...curTasks, task])
            );
        } catch (e) {
            console.error(e);
        }
    }

    async updateTask(freshTask: Task): Promise<void> {
        try {
            const curTasks = await this.getTasks();
            const newTasks = curTasks.map(t =>
                t.id === freshTask.id ? freshTask : t
            );

            await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
        } catch (e) {
            console.error(e);
        }
    }

    async deleteTask(task: Task): Promise<void> {
        try {
            const curTasks = await this.getTasks();
            const newTasks = curTasks.filter(t => t.id != task.id);

            await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
        } catch (e) {
            console.error(e);
        }
    }

    async toggleTask(taskId: string): Promise<void> {
        try {
            const curTasks = await this.getTasks();

            const newTasks = curTasks.map(t => {
                if (t.id === taskId) {
                    t.completed = !t.completed;
                }

                return t;
            });

            await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
        } catch (e) {
            console.error(e);
        }
    }
}

class Habits {
    async getHabits(): Promise<Habit[]> {
        try {
            const habits = await AsyncStorage.getItem('habits');
            if (habits !== null) {
                return JSON.parse(habits).sort(
                    (a: Habit, b: Habit) => a.createdAt - b.createdAt
                );
            }

            return [];
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async createHabit(habit: Habit): Promise<void> {
        try {
            const curHabits = await this.getHabits();
            await AsyncStorage.setItem(
                'habits',
                JSON.stringify([...curHabits, habit])
            );
        } catch (e) {
            console.error(e);
        }
    }

    async updateHabit(freshHabit: Habit): Promise<void> {
        try {
            const curHabits = await this.getHabits();
            const newHabits = curHabits.map(t =>
                t.id === freshHabit.id ? freshHabit : t
            );

            await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
        } catch (e) {
            console.error(e);
        }
    }

    async deleteHabit(habit: Habit): Promise<void> {
        try {
            const curHabits = await this.getHabits();
            const newHabits = curHabits.filter(h => h.id != habit.id);

            await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
        } catch (e) {
            console.error(e);
        }
    }

    async addCompletionToHabit(habit: Habit, dayStr: string = 'today') {
        if (dayStr == 'today') {
            dayStr = DateTime.now().toFormat('yyyy-LL-dd');
        }

        try {
            const curHabits = await this.getHabits();
            const newHabits = curHabits.map(h => {
                if (h.id === habit.id) {
                    const { completionMatrix } = h;

                    if (!completionMatrix[dayStr]) {
                        completionMatrix[dayStr] = 1;
                    } else {
                        if (completionMatrix[dayStr] < h.dailyGoal) {
                            completionMatrix[dayStr]++;
                        }
                    }

                    return {
                        ...h,
                        completionMatrix,
                        updatedAt: DateTime.now().toMillis(),
                    };
                }

                return h;
            });

            await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
        } catch (e) {
            console.error(e);
        }
    }

    async populateFakeCompletion(habit: Habit, days: number) {
        const start = DateTime.now();

        const dayStrs = [...new Array(days)].map((_, idx) => {
            return start.minus({ days: idx }).toFormat('yyyy-LL-dd');
        });

        const matrix = {};

        for (const str of dayStrs) {
            matrix[str] = Math.round(Math.random() * habit.dailyGoal);
        }

        console.log(matrix);

        try {
            const curHabits = await this.getHabits();
            const newHabits = curHabits.map(h => {
                if (h.id === habit.id) {
                    h.completionMatrix = matrix;
                }

                return h;
            });

            await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
        } catch (e) {
            console.error(e);
        }
    }
}

class LocalStorage {
    public tasks: Tasks;
    public habits: Habits;

    constructor() {
        this.tasks = new Tasks();
        this.habits = new Habits();
    }
}

const LS = new LocalStorage();
export default LS;
