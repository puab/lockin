import { ScrollView, StyleSheet, View } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { Button, Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { COLORS } from '../../Theme';
import { useAppContext } from '../../contexts/AppContext';
import HabitItem from './components/HabitItem';
import { Habit } from './Types';

export default function HabitScreen({ navigation }) {
    const habits = useAppContext<Habit[]>(s => s.habits);

    useEffect(() => {
        navigation?.setOptions({
            headerRight: () => (
                <Button
                    style={{ marginRight: 15 }}
                    mode='elevated'
                    icon={'plus'}
                    onPress={() => navigation?.navigate('New habit')}
                >
                    Create
                </Button>
            ),
        });
    }, []);

    function wantsCompletion(habit: Habit) {}

    return (
        <PageLayout style={S.page}>
            <ScrollView>
                <View style={S.list}>
                    {habits.map(habit => (
                        <HabitItem
                            key={`habit${habit.id}`}
                            habit={habit}
                            wantsCompletion={() => wantsCompletion(habit)}
                        />
                    ))}
                </View>
            </ScrollView>
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: {
        padding: 5,
        paddingBottom: 0,
    },
    list: {
        gap: 10,
        paddingBottom: 50,
    },
});
