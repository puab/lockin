import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import { Button, Icon, Text } from 'react-native-paper';
import API from '../../API';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppTheme from '../../Theme';
import AuthDialog from './components/AuthDialog';
import { SyncData, useAppStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';

import AES from 'crypto-js/aes';
import UTF8 from 'crypto-js/enc-utf8';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
    const state = useAppStore(
        useShallow(s => ({
            tasks: s.tasks,
            habits: s.habits,
            goals: s.goals,
            journals: s.journals,
        }))
    );

    const importData = useAppStore(useShallow(s => s._importData));

    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);
    const [syncType, setSyncType] = useState<'export' | 'import' | undefined>();

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

            Toast.show({
                type: 'success',
                text1: 'Export success',
                text2: `Press "import" from any device to retreive your data`,
            });
        } else if (syncType == 'import') {
            const payload = await API.importData();

            const data: SyncData = JSON.parse(
                AES.decrypt(payload, encryptionKey).toString(UTF8)
            );

            importData(data);

            Toast.show({
                type: 'success',
                text1: 'Import success',
                text2: `Your exported data has been loaded on this device`,
            });
        }

        setIsSyncing(false);
    }

    return (
        <PageLayout style={S.page}>
            <View style={S.serverStatusContent}>
                <Button
                    mode='contained'
                    icon={'file-export-outline'}
                    onPress={wantsExport}
                    style={{
                        flex: 1,
                    }}
                    disabled={isSyncing && syncType == 'import'}
                    loading={isSyncing && syncType == 'export'}
                >
                    Export data
                </Button>

                <Button
                    mode='contained'
                    icon={'file-import-outline'}
                    onPress={wantsImport}
                    style={{
                        flex: 1,
                    }}
                    disabled={isSyncing && syncType == 'export'}
                    loading={isSyncing && syncType == 'import'}
                >
                    Import data
                </Button>
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
        padding: 10,
    },

    serverStatusText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },

    serverStatusContent: {
        flexDirection: 'row',
        gap: 10,
    },
});
