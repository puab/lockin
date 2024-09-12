import { createContext, useContext, useEffect, useState } from 'react';
import API from '../API';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

export type AuthContextType = {
    user: any;
    setUser: (u: any) => void;
    checkingUser: boolean;
    reloadUser: () => Promise<void>;
    nav: NativeStackNavigationProp<any> | null;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    checkingUser: false,
    reloadUser: async () => {},
    nav: null,
});

export function AuthContextProvider({ children }) {
    const nav = useNavigation<NativeStackNavigationProp<any>>();

    const [user, setUser] = useState<any>(null);
    const [checkingUser, setCheckingUser] = useState<boolean>(false);

    async function reloadUser() {
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

    useEffect(() => {
        reloadUser();

        // nav.addListener('transitionEnd', e => {
        //     if (e.target == 'Home') {
        //         setCheckingUser(c => {
        //             if (c) return false;
        //             return c;
        //         });
        //     }
        // });
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, setUser, checkingUser, reloadUser, nav }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
