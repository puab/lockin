import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ax = axios.create({
    baseURL: 'http://192.168.39.4:8000',
    headers: {
        Accept: 'application/json',
    },
});

ax.interceptors.request.use(async req => {
    const token = await API.getToken();

    if (token !== null) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

function handleFetchError(e: any) {
    if (axios.isAxiosError(e)) {
        const err = e as AxiosError;
        return err.response?.data as { [key: string]: any } | undefined;
    } else {
        console.error(e);
        return e;
    }
}

type ResponseType = Promise<{ [key: string]: any } | undefined>;

class _API {
    private token: string | null = null;

    constructor() {
        this.getToken();
    }

    async setToken(newToken: string | null) {
        this.token = newToken;

        if (this.token !== null) {
            await SecureStore.setItemAsync('token', this.token);
        } else {
            await SecureStore.deleteItemAsync('token');
        }
    }

    async getToken() {
        if (this.token !== null) {
            return this.token;
        }

        this.token = await SecureStore.getItemAsync('token');
        return this.token;
    }

    async loadUser() {
        await this.getToken();

        const { data: user } = await ax.get('/api/user');

        return user;
    }

    async login(username: string, password: string): ResponseType {
        try {
            const res = await ax.post('/api/login', {
                username,
                password,
                device_name: `${Platform.OS} ${Platform.Version}`,
            });

            const success: boolean = res.data.token;
            if (success) this.setToken(res.data.token);

            return {
                success,
            };
        } catch (e: any) {
            return handleFetchError(e);
        }
    }

    async logout() {
        try {
            await ax.post('/api/logout');
            await this.setToken(null);
        } catch (e) {
            console.error(handleFetchError(e));
        }
    }

    async register(
        username: string,
        password: string,
        passwordConfirmation: string,
        email: string
    ): ResponseType {
        try {
            const res = await ax.post('/api/register', {
                username,
                password,
                password_confirmation: passwordConfirmation,
                email,
                device_name: `${Platform.OS} ${Platform.Version}`,
            });

            const success: boolean = res.data.token;
            if (success) this.setToken(res.data.token);

            return {
                success,
            };
        } catch (e: any) {
            return handleFetchError(e);
        }
    }
}

const API = new _API();
export default API;
