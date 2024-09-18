import { StyleSheet } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { DateNow } from '../../Util';
import DateRow from './components/DateRow';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import {
    Button,
    Dialog,
    Divider,
    FAB,
    Portal,
    Snackbar,
    Text,
} from 'react-native-paper';
import TaskList from './components/TaskList';
import { Task } from './Types';
import EditDialog from './components/EditDialog';
import LS from '../../LocalStorage';
import { useAppContext } from '../../contexts/AppContext';

export default function TasksScreen({ navigation }) {
    const reloadTasksFromStorage = useAppContext(s => s.reloadTasksFromStorage);

    const [curDate, setCurDate] = useState<DateTime>(DateNow);
    useEffect(() => {
        navigation?.setOptions({
            headerRight: () => (
                <Text style={{ color: 'black', marginRight: 15 }}>
                    {curDate.toLocaleString(DateTime.DATE_FULL)}
                </Text>
            ),
        });
    }, [curDate]);

    const [isEditing, setEditing] = useState<boolean>(false);
    const editTargetRef = useRef<Task | null>(null);
    function wantsEdit(task: Task) {
        editTargetRef.current = task;
        setEditing(true);
    }

    const [justDeleted, setJustDeleted] = useState<boolean>(false);
    const deleteTargetRef = useRef<Task | null>(null);
    async function wantsDelete(task: Task) {
        deleteTargetRef.current = task;
        await LS.deleteTask(task);
        await reloadTasksFromStorage();
        setJustDeleted(true);
    }

    return (
        <PageLayout style={S.page}>
            <FAB
                icon={'plus'}
                style={S.fab}
                onPress={() =>
                    navigation?.navigate('New task', {
                        currentDateMs: curDate.toMillis(),
                    })
                }
            />

            <DateRow
                selected={curDate}
                onChange={d => setCurDate(d)}
            />

            <Divider />

            <TaskList
                active={curDate}
                wantsEdit={wantsEdit}
                wantsDelete={wantsDelete}
            />

            <EditDialog
                open={isEditing}
                setOpen={setEditing}
                task={editTargetRef.current as Task}
            />

            <Portal>
                <Snackbar
                    visible={justDeleted}
                    onDismiss={() => {
                        deleteTargetRef.current = null;
                        setJustDeleted(false);
                    }}
                    action={{
                        label: 'Undo',
                        onPress: async () => {
                            if (deleteTargetRef.current) {
                                await LS.createTask(deleteTargetRef.current),
                                    await reloadTasksFromStorage();
                            }
                        },
                    }}
                >
                    Deleted task
                </Snackbar>
            </Portal>
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: { padding: 5, paddingBottom: 0 },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1,
    },
});
