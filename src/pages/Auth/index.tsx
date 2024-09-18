import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { Fold } from 'react-native-animated-spinkit';
import { useEffect, useState } from 'react';
import FormTextField from '../../components/FormTextField';

import API from '../../API';
import { useAuthContext } from '../../contexts/AppContext';

import { Button, Text } from 'react-native-paper';
import AppTheme from '../../Theme';
import LoaderPlaceholder from '../../components/LoaderPlaceholder';

export default function AuthScreen({ navigation }) {
    const checkingUser = useAuthContext(s => s.checkingUser);
    const reloadUser = useAuthContext(s => s.reloadUser);

    const [busy, setBusy] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [wantsRegister, setWantsRegister] = useState<boolean>(false);
    useEffect(() => {
        setErrors({});
    }, [wantsRegister]);

    async function handleSubmit() {
        setErrors({});
        setBusy(true);

        let success = false;

        if (!wantsRegister) {
            const res = await API.login(username, password);
            if (res) {
                success = res.success;
                if (res.errors) {
                    setErrors(res.errors);
                }
            }
        } else {
            const res = await API.register(
                username,
                password,
                confirmPassword,
                email
            );
            if (res) {
                success = res.success;
                if (res.errors) {
                    setErrors(res.errors);
                }
            }
        }

        if (success) {
            await reloadUser();
            navigation.navigate('Home');
        }

        setBusy(false);
    }

    return (
        <PageLayout style={S.container}>
            {checkingUser ? (
                <LoaderPlaceholder />
            ) : (
                <>
                    <View style={S.form}>
                        <FormTextField
                            label='Username'
                            value={username}
                            onChange={setUsername}
                            errors={errors.username}
                        />

                        <FormTextField
                            label='Password'
                            value={password}
                            onChange={setPassword}
                            errors={errors.password}
                            password
                        />

                        {wantsRegister && (
                            <>
                                <FormTextField
                                    label='Confirm password'
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    password
                                />

                                <FormTextField
                                    label='E-Mail'
                                    value={email}
                                    onChange={setEmail}
                                    errors={errors.email}
                                    password
                                />
                            </>
                        )}

                        <Button
                            mode='outlined'
                            loading={busy}
                            onPress={handleSubmit}
                        >
                            {wantsRegister ? `Register` : `Login`}
                        </Button>

                        <TouchableOpacity
                            style={S.switcher}
                            onPress={() => setWantsRegister(w => !w)}
                        >
                            <Text
                                style={S.switcherText}
                                variant='labelLarge'
                            >
                                {wantsRegister
                                    ? `Already registered?`
                                    : `Don't have an account?`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </PageLayout>
    );
}

const S = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50,
    },
    form: {
        width: '100%',
        gap: 10,
    },
    switcher: {
        marginHorizontal: 'auto',
    },
    switcherText: {
        textDecorationLine: 'underline',
    },
});
