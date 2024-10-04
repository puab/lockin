import { BackHandler, StyleSheet } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { DateNow } from '../../Util';
import DateRow from './components/DateRow';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Divider, Portal, Snackbar, Text } from 'react-native-paper';
import TaskList from './components/TaskList';
import { Task } from './Types';
import EditTaskDialog from './components/EditTaskDialog';
import AddItemButton from '../../components/AddItemButton';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import NewTaskSheet from './components/NewTaskSheet';
import { useFocusEffect } from '@react-navigation/native';
import useSheetBack from '../../hooks/useSheetBack';

export default function TasksScreen({ route, navigation }) {
    const [newTaskSheetOpen, setNewTaskSheetOpen] = useState<boolean>(false);
    useSheetBack(newTaskSheetOpen, setNewTaskSheetOpen);

    const [deleteTask, addTask] = useAppStore(
        useShallow(s => [s.deleteTask, s.addTask])
    );

    const tasks = useAppStore(s => s.tasks);

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
    function wantsDelete(task: Task) {
        deleteTargetRef.current = task;
        deleteTask(task);
        setJustDeleted(true);
    }

    return (
        <PageLayout style={S.page}>
            {curDate.startOf('day').toMillis() >=
                DateNow.startOf('day').toMillis() && (
                <AddItemButton
                    onPress={() => {
                        // setJustDeleted(false);
                        // navigation?.navigate('New task', {
                        //     currentDateMs: curDate.toMillis(),
                        // });
                        setNewTaskSheetOpen(true);
                    }}
                />
            )}

            {useMemo(
                () => (
                    <NewTaskSheet
                        activeDate={curDate}
                        open={newTaskSheetOpen}
                        setOpen={setNewTaskSheetOpen}
                    />
                ),
                [newTaskSheetOpen]
            )}

            <DateRow
                selected={curDate}
                onChange={dateStr =>
                    setCurDate(DateTime.fromFormat(dateStr, 'yyyy-LL-dd'))
                }
            />

            <Divider />

            {useMemo(
                () => (
                    <TaskList
                        tasks={tasks}
                        active={curDate}
                        wantsEdit={wantsEdit}
                        wantsDelete={wantsDelete}
                    />
                ),
                [curDate, tasks]
            )}

            {useMemo(
                () => (
                    <EditTaskDialog
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
                                onPress: () => {
                                    if (deleteTargetRef.current) {
                                        addTask(deleteTargetRef.current);
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
    page: {
        paddingTop: 5,
    },
});
