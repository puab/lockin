import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from './pages/Tasks/Types';

class _LS {
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

const LS = new _LS();
export default LS;
