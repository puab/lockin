import { StyleSheet } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { DateNow } from '../../Util';
import DateRow from './components/DateRow';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import AddItemButton from '../../components/AddItemButton';

export default function TasksScreen({ route, navigation }) {
    const reloadTasksFromStorage = useAppContext(s => s.reloadTasksFromStorage);
    const currentDateMs = route?.params?.currentDateMs;

    const [curDate, setCurDate] = useState<DateTime>(
        currentDateMs ? DateTime.fromMillis(currentDateMs) : DateNow
    );
    useEffect(() => {
        navigation?.setOptions({
            headerRight: () => (
                <Text style={{ color: 'black', marginRight: 15 }}>
                    {curDate.toLocaleString(DateTime.DATE_FULL)}
                </Text>
            ),
        });
    }, [curDate]);

    useMemo(() => {
        if (currentDateMs) setCurDate(DateTime.fromMillis(currentDateMs));
    }, [currentDateMs]);

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
        await LS.tasks.deleteTask(task);
        await reloadTasksFromStorage();
        setJustDeleted(true);
    }

    return (
        <PageLayout style={S.page}>
            {curDate.startOf('day').toMillis() >=
                DateNow.startOf('day').toMillis() && (
                <AddItemButton
                    onPress={() =>
                        navigation?.navigate('New task', {
                            currentDateMs: curDate.toMillis(),
                        })
                    }
                />
            )}

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

            {useMemo(
                () => (
                    <EditDialog
                        open={isEditing}
                        setOpen={setEditing}
                        task={editTargetRef.current as Task}
                    />
                ),
                [isEditing]
            )}

            {useMemo(
                () => (
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
                                        await LS.tasks.createTask(
                                            deleteTargetRef.current
                                        ),
                                            await reloadTasksFromStorage();
                                    }
                                },
                            }}
                        >
                            Deleted task
                        </Snackbar>
                    </Portal>
                ),
                [justDeleted]
            )}
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: { padding: 5, paddingBottom: 0 },
});
