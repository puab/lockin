import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

import { createContext, useContextSelector } from 'use-context-selector';
import LoaderPlaceholder from '../components/LoaderPlaceholder';
import PageLayout from '../components/PageLayout';
import { useAppStore } from '../store';

export type AppContextType = {
    nav: NativeStackNavigationProp<any> | null;
};

const AppContext = createContext<AppContextType>({
    nav: null,
});

export function AppContextProvider({ children }) {
    const isHydrated = useAppStore(s => s._hasHydrated);

    const nav = useNavigation<NativeStackNavigationProp<any>>();

    return (
        <AppContext.Provider
            value={{
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
