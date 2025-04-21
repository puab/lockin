import { Button, Dialog, Portal, Text } from 'react-native-paper';
import FormTextField from '../../../components/FormTextField';
import { useEffect, useState } from 'react';
import API from '../../../API';
import AppTheme from '../../../Theme';

import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

type AuthDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onAuthSuccess: (encryptionKey: string) => void;
};

export default function AuthDialog({
    open,
    setOpen,
    onAuthSuccess,
}: AuthDialogProps) {
    const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

    const [busy, setBusy] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        (async () => {
            const savedUsername = await SecureStore.getItemAsync(
                'savedUsername'
            );
            if (savedUsername) {
                setUsername(savedUsername);
            }
        })();
    }, []);

    function clearInputs() {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
    }

    async function wantsLogin() {
        setBusy(true);

        const res = await API.checkCredentials(username, password);

        if (res?.message != 'success') {
            setErrorMessage(res?.message ?? 'Unknown error');
        } else {
            setErrorMessage('');
            onAuthSuccess(res.encryptionKey);
            await SecureStore.setItemAsync('savedUsername', username);
        }

        setBusy(false);
    }

    async function wantsRegister() {
        setBusy(true);

        if (password != confirmPassword) {
            setErrorMessage('Passwords do not match');
            setBusy(false);
            return;
        }

        const res = await API.register(username, password);

        if (res?.message != 'success') {
            setErrorMessage(res?.message ?? 'Unknown error');
        } else {
            setErrorMessage('');

            Toast.show({
                type: 'success',
                text1: 'Registration success',
                text2: `Press login to continue`,
            });
            setIsRegisterMode(false);
            clearInputs();
        }

        setBusy(false);
    }

    return (
        <Portal>
            <Dialog
                visible={open}
                onDismiss={() => setOpen(false)}
            >
                <Dialog.Title
                    style={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                    Sync auth
                </Dialog.Title>

                <Dialog.Content style={{ gap: 5 }}>
                    {!!errorMessage && (
                        <Text
                            style={{
                                color: AppTheme.colors.error,
                                textAlign: 'center',
                            }}
                        >
                            {errorMessage}
                        </Text>
                    )}

                    <FormTextField
                        label='Username'
                        value={username}
                        onChange={setUsername}
                    />

                    <FormTextField
                        label='Password'
                        password={true}
                        value={password}
                        onChange={setPassword}
                    />

                    {isRegisterMode && (
                        <FormTextField
                            label='Confirm password'
                            password={true}
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />
                    )}

                    <Button
                        mode='elevated'
                        icon={'lock'}
                        onPress={isRegisterMode ? wantsRegister : wantsLogin}
                        loading={busy}
                    >
                        {isRegisterMode ? 'Sign up' : 'Login'}
                    </Button>

                    <Text style={{ textAlign: 'center' }}>
                        {isRegisterMode
                            ? 'Already have an account? '
                            : "Don't have an account? "}
                        <Text
                            style={{ textDecorationLine: 'underline' }}
                            onPress={() => setIsRegisterMode(!isRegisterMode)}
                        >
                            {isRegisterMode ? 'Login' : 'Sign up'}
                        </Text>
                    </Text>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}
