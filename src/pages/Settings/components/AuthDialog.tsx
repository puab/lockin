import { Button, Dialog, Portal, Text } from 'react-native-paper';
import FormTextField from '../../../components/FormTextField';
import { useEffect, useState } from 'react';
import API from '../../../API';
import AppTheme from '../../../Theme';

import * as SecureStore from 'expo-secure-store';

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
    const [busy, setBusy] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

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

                    <Button
                        mode='elevated'
                        icon={'lock'}
                        onPress={wantsLogin}
                        loading={busy}
                    >
                        Login
                    </Button>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}
