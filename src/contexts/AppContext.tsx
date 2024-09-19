import { useEffect, useState } from 'react';
import API from '../API';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

import { createContext, useContextSelector } from 'use-context-selector';
import LS from '../LocalStorage';
import { Task } from '../pages/Tasks/Types';
import { Habit } from '../pages/Habits/Types';
import { delay } from '../Util';
import LoaderPlaceholder from '../components/LoaderPlaceholder';
import PageLayout from '../components/PageLayout';

export type AppContextType = {
    initialLoad: boolean;

    user: any;
    setUser: (u: any) => void;
    checkingUser: boolean;
    tryLoadUser: () => Promise<void>;

    tasks: Task[];
    reloadTasksFromStorage: () => Promise<void>;

    habits: Habit[];
    reloadHabitsFromStorage: () => Promise<void>;

    nav: NativeStackNavigationProp<any> | null;
};

const AppContext = createContext<AppContextType>({
    initialLoad: true,

    user: null,
    setUser: () => {},
    checkingUser: false,
    tryLoadUser: async () => {},

    tasks: [],
    reloadTasksFromStorage: async () => {},

    habits: [],
    reloadHabitsFromStorage: async () => {},

    nav: null,
});

export function AppContextProvider({ children }) {
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const nav = useNavigation<NativeStackNavigationProp<any>>();

    const [user, setUser] = useState<any>(null);
    const [checkingUser, setCheckingUser] = useState<boolean>(false);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);

    async function tryLoadUser() {
        try {
            setCheckingUser(true);
            const user = await API.loadUser();

            // if passes to here then success, otherwise throws
            setUser(user);
            nav.navigate('Home');
            setCheckingUser(false);
        } catch (e) {
            setCheckingUser(false);
        }
    }

    async function reloadTasksFromStorage() {
        await LS.tasks.clearOldTasks();
        const lsTasks = await LS.tasks.getTasks();
        setTasks(lsTasks);
    }

    async function reloadHabitsFromStorage() {
        await delay(2000);
        const lsHabits = await LS.habits.getHabits();
        setHabits(lsHabits);
    }

    useEffect(() => {
        (async () => {
            await Promise.all([
                reloadTasksFromStorage(),
                reloadHabitsFromStorage(),
            ]);
            setInitialLoad(false);
        })();
    }, []);

    return (
        <AppContext.Provider
            value={{
                initialLoad,

                user,
                setUser,
                checkingUser,
                tryLoadUser,
                nav,

                tasks,
                reloadTasksFromStorage,

                habits,
                reloadHabitsFromStorage,
            }}
        >
            {initialLoad ? (
                <PageLayout>
                    <LoaderPlaceholder />
                </PageLayout>
            ) : (
                children
            )}
        </AppContext.Provider>
    );
}

export function useAppContext<T = any>(select: (state: AppContextType) => any) {
    return useContextSelector(AppContext, select) as T;
}
