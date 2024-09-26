import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Task } from '../Types';
import API from '../../../API';
import LoaderPlaceholder from '../../../components/LoaderPlaceholder';
import { Menu, overlay, RadioButton, Text } from 'react-native-paper';
import { useAppContext } from '../../../contexts/AppContext';
import { DateTime } from 'luxon';
import AppTheme, { COLORS } from '../../../Theme';
import LS from '../../../LocalStorage';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import TaskEntry from './TaskEntry';

type TaskListProps = {
    active: DateTime;
    wantsEdit: (task: Task) => void;
    wantsDelete: (task: Task) => void;
};

export default function TaskList({
    active,
    wantsEdit,
    wantsDelete,
}: TaskListProps) {
    const tasks = useAppContext<Task[]>(s => s.tasks);

    const activeDateStr = active.toFormat('yyyy-LL-dd');

    const displayTasks = tasks.filter(t => t.date === activeDateStr);

    return (
        <ScrollView style={list.scrollView}>
            <View style={list.container}>
                {displayTasks?.length === 0 ? (
                    <Text style={{ marginHorizontal: 'auto' }}>
                        No tasks this day
                    </Text>
                ) : (
                    displayTasks.map(t => {
                        return (
                            <TaskEntry
                                key={`te${t.id}`}
                                task={t}
                                wantsEdit={() => wantsEdit(t)}
                                wantsDelete={() => wantsDelete(t)}
                            />
                        );
                    })
                )}
            </View>
        </ScrollView>
    );
}

const list = StyleSheet.create({
    scrollView: {
        // backgroundColor: 'red',
        paddingHorizontal: 10,
    },
    container: {
        gap: 10,
        paddingTop: 5,
        paddingBottom: 50,
    },
});
