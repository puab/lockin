import { useEffect, useState } from 'react';
import API from '../API';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

import { createContext, useContextSelector } from 'use-context-selector';
import LS from '../LocalStorage';
import { Task } from '../pages/Tasks/Types';

export type AppContextType = {
    user: any;
    setUser: (u: any) => void;
    checkingUser: boolean;
    tryLoadUser: () => Promise<void>;

    tasks: Task[];
    reloadTasksFromStorage: () => Promise<void>;

    nav: NativeStackNavigationProp<any> | null;
};

const AppContext = createContext<AppContextType>({
    user: null,
    setUser: () => {},
    checkingUser: false,
    tryLoadUser: async () => {},

    tasks: [],
    reloadTasksFromStorage: async () => {},

    nav: null,
});

export function AuthContextProvider({ children }) {
    const nav = useNavigation<NativeStackNavigationProp<any>>();

    const [user, setUser] = useState<any>(null);
    const [checkingUser, setCheckingUser] = useState<boolean>(false);

    const [tasks, setTasks] = useState<Task[]>([]);

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
        const lsTasks = await LS.getTasks();
        setTasks(lsTasks);
    }

    useEffect(() => {
        tryLoadUser();
        reloadTasksFromStorage();
    }, []);

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                checkingUser,
                tryLoadUser,
                nav,
                tasks,
                reloadTasksFromStorage,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext<T = any>(select: (state: AppContextType) => any) {
    return useContextSelector(AppContext, select) as T;
}
