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
import { useAppStore } from '../store';

export type AppContextType = {
    user: any;
    setUser: (u: any) => void;
    checkingUser: boolean;
    tryLoadUser: () => Promise<void>;

    nav: NativeStackNavigationProp<any> | null;
};

const AppContext = createContext<AppContextType>({
    user: null,
    setUser: () => {},
    checkingUser: false,
    tryLoadUser: async () => {},

    nav: null,
});

export function AppContextProvider({ children }) {
    const isHydrated = useAppStore(s => s._hasHydrated);

    const nav = useNavigation<NativeStackNavigationProp<any>>();

    const [user, setUser] = useState<any>(null);
    const [checkingUser, setCheckingUser] = useState<boolean>(false);

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

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                checkingUser,
                tryLoadUser,

                nav,
            }}
        >
            {!isHydrated ? (
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
