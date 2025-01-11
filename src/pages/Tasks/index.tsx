import { StyleSheet } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { DateNow } from '../../Util';
import DateRow from './components/DateRow';
import { DateTime } from 'luxon';
import { useMemo, useRef, useState } from 'react';
import { Divider, Portal, Snackbar, Text } from 'react-native-paper';
import TaskList from './components/TaskList';
import { Task } from './Types';
import AddItemButton from '../../components/AddItemButton';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import CreateOrUpdateTaskSheet from './components/CreateOrUpdateTaskSheet';
import useSheetBack from '../../hooks/useSheetBack';
import useHeaderRight from '../../hooks/useHeaderRight';

export default function TasksScreen({
    route,
    navigation,
}: {
    route?: any;
    navigation?: any;
}) {
    const [taskSheetOpen, setTaskSheetOpen] = useState<boolean>(false);
    useSheetBack(taskSheetOpen, setTaskSheetOpen);

    const [deleteTask, createTask] = useAppStore(
        useShallow(s => [s.deleteTask, s.createTask])
    );

    const tasks = useAppStore(s => s.tasks);

    const currentDateMs = route?.params?.currentDateMs;

    const [curDate, setCurDate] = useState<DateTime>(
        currentDateMs ? DateTime.fromMillis(currentDateMs) : DateNow
    );
    useHeaderRight(
        <Text style={{ color: 'black', marginRight: 15 }}>
            {curDate.toLocaleString(DateTime.DATE_FULL)}
        </Text>,

        [curDate]
    );

    useMemo(() => {
        if (currentDateMs) setCurDate(DateTime.fromMillis(currentDateMs));
    }, [currentDateMs]);

    const [justDeleted, setJustDeleted] = useState<boolean>(false);
    const deleteTargetRef = useRef<Task | null>(null);
    function wantsDelete(task: Task) {
        deleteTargetRef.current = task;
        deleteTask(task);
        setJustDeleted(true);
    }

    const editTargetRef = useRef<Task | null>(null);
    function wantsEdit(task: Task) {
        editTargetRef.current = task;
        setJustDeleted(false);
        setTaskSheetOpen(true);
    }

    function wantsCreate() {
        editTargetRef.current = null;
        setJustDeleted(false);
        setTaskSheetOpen(true);
    }

    const currentlyInPast =
        curDate.startOf('day').toMillis() < DateNow.startOf('day').toMillis();

    return (
        <PageLayout style={S.page}>
            {!currentlyInPast && <AddItemButton onPress={wantsCreate} />}

            {useMemo(
                () => (
                    <CreateOrUpdateTaskSheet
                        activeDate={curDate}
                        open={taskSheetOpen}
                        setOpen={setTaskSheetOpen}
                        editTarget={editTargetRef.current}
                    />
                ),
                [taskSheetOpen]
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
                        currentlyInPast={currentlyInPast}
                    />
                ),
                [curDate, tasks]
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
                                        createTask(deleteTargetRef.current);
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
