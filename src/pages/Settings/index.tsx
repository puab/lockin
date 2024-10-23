import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import { Button, Icon, Text } from 'react-native-paper';
import API from '../../API';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppTheme from '../../Theme';
import AuthDialog from './components/AuthDialog';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';

import AES from 'crypto-js/aes';
import UTF8 from 'crypto-js/enc-utf8';

export default function SettingsScreen() {
    const state = useAppStore(
        useShallow(s => ({
            tasks: s.tasks,
            habits: s.habits,
            goals: s.goals,
            journals: s.journals,
        }))
    );

    const [isServerOn, setIsServerOn] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(true);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);
    const [syncType, setSyncType] = useState<'export' | 'import' | undefined>();

    async function attemptConnection() {
        setIsConnecting(true);

        const isGood = await API.ping();

        setIsServerOn(isGood);
        setIsConnecting(false);
    }

    useEffect(() => {
        attemptConnection();
    }, []);

    function wantsExport() {
        setSyncType('export');
        setIsAuthDialogOpen(true);
    }

    function wantsImport() {
        setSyncType('import');
        setIsAuthDialogOpen(true);
    }

    async function onAuthSuccess(encryptionKey: string) {
        setIsAuthDialogOpen(false);

        setIsSyncing(true);

        if (syncType == 'export') {
            const payload = AES.encrypt(
                JSON.stringify(state),
                encryptionKey
            ).toString();

            await API.exportData(payload);
        } else if (syncType == 'import') {
            const payload = await API.importData();

            const data = AES.decrypt(payload, encryptionKey).toString(UTF8);

            console.log(data);
        }

        setIsSyncing(false);

        // if (
        //     AES.decrypt(payload, encryptionKey).toString(UTF8) ===
        //     JSON.stringify(state)
        // ) {
        //     console.log('Encryption test passed');
        // }
    }

    return (
        <PageLayout style={S.page}>
            <View style={S.serverStatusContainer}>
                <View style={S.serverStatusContainerHeader}>
                    <Text style={S.serverStatusText}>
                        {isConnecting
                            ? 'Connecting...'
                            : isServerOn
                            ? 'Connected!'
                            : `Couldn't connect`}
                    </Text>

                    {!isConnecting && !isServerOn && (
                        <TouchableOpacity onPress={attemptConnection}>
                            <Icon
                                size={20}
                                color={AppTheme.colors.primary}
                                source={'refresh-circle'}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={S.serverStatusContent}>
                    <Button
                        mode='contained'
                        icon={'file-export-outline'}
                        onPress={wantsExport}
                        disabled={isConnecting || !isServerOn}
                        style={{
                            flex: 1,
                        }}
                        loading={isSyncing}
                    >
                        Export data
                    </Button>

                    <Button
                        mode='contained'
                        icon={'file-import-outline'}
                        onPress={wantsImport}
                        disabled={isConnecting || !isServerOn}
                        style={{
                            flex: 1,
                        }}
                        loading={isSyncing}
                    >
                        Import data
                    </Button>
                </View>
            </View>

            <AuthDialog
                open={isAuthDialogOpen}
                setOpen={setIsAuthDialogOpen}
                onAuthSuccess={onAuthSuccess}
            />
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: {
        gap: 5,
        padding: 5,
    },

    serverStatusContainer: {
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        gap: 5,
    },
    serverStatusContainerHeader: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    serverStatusText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },

    serverStatusContent: {
        flexDirection: 'row',
        gap: 5,
    },
});
