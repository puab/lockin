import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

const ax = axios.create({
    baseURL: 'http://192.168.136.4:8090',
    // baseURL: 'https://organizo-api.bru.lv',
    headers: {
        Accept: 'application/json',
    },
    timeout: 5000,
});

function handleFetchError(e: any) {
    if (axios.isAxiosError(e)) {
        const err = e as AxiosError;
        return err.response?.data as { [key: string]: any } | undefined;
    } else {
        return e;
    }
}

class _API {
    async ping() {
        await new Promise(res => setTimeout(res, 1000));

        try {
            const { data } = await ax.get('/ping');

            return data.message === 'pong';
        } catch (e) {
            return false;
        }
    }

    async checkCredentials(username: string, password: string) {
        await new Promise(res => setTimeout(res, 1000));

        try {
            const res = await ax.post('/check-credentials', {
                username,
                password,
            });

            console.log(res);

            return res.data;
        } catch (e) {
            return handleFetchError(e);
        }
    }

    async register(username: string, password: string) {
        await new Promise(res => setTimeout(res, 1000));

        try {
            const res = await ax.post('/register', {
                username,
                password,
            });

            console.log(res);

            return res.data;
        } catch (e) {
            return handleFetchError(e);
        }
    }

    async exportData(data: string) {
        await new Promise(res => setTimeout(res, 1000));

        try {
            const savedUsername = await SecureStore.getItemAsync(
                'savedUsername'
            );

            if (!savedUsername) throw 'No saved username';

            const { data: res } = await ax.post('/export-data', {
                data,
                username: savedUsername,
            });

            return res;
        } catch (e) {
            return handleFetchError(e);
        }
    }

    async importData() {
        await new Promise(res => setTimeout(res, 1000));

        try {
            const savedUsername = await SecureStore.getItemAsync(
                'savedUsername'
            );

            if (!savedUsername) throw 'No saved username';

            const { data: res } = await ax.post('/import-data', {
                username: savedUsername,
            });

            return res.data;
        } catch (e) {
            return handleFetchError(e);
        }
    }
}

const API = new _API();
export default API;
