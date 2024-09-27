import { Button, Divider, Icon, Text } from 'react-native-paper';
import PageLayout from '../../components/PageLayout';
import { useEffect, useState } from 'react';
import HeaderBackButton from '../../components/HeaderBackButton';
import AppTheme, { COLORS, ICONS } from '../../Theme';
import ColorSelector from '../../components/ColorSelector';
import useErrorStack from '../../hooks/useErrorStack';
import FormTextField from '../../components/FormTextField';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DailyGoalControl from './components/DailyGoalControl';
import IconSelector from './components/IconSelector';
import { Habit } from './Types';
import { uuid } from '../../Util';
import { DateTime } from 'luxon';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';

export default function NewHabitScreen({ navigation }) {
    const addHabit = useAppStore(useShallow(s => s.addHabit));

    const { errors, validate } = useErrorStack();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dailyGoal, setDailyGoal] = useState<number>(1);
    const [icon, setIcon] = useState<string>(ICONS[0]);
    const [color, setColor] = useState<string>('white');

    function reset() {
        setName('');
        setDescription('');
        setDailyGoal(1);
        setIcon(ICONS[0]);
        setColor('white');
    }

    useEffect(() => {
        navigation?.setOptions({
            headerLeft: () => (
                <HeaderBackButton
                    onPress={() => {
                        navigation.navigate('Habits');
                        reset();
                    }}
                />
            ),
        });
    }, []);

    useEffect(() => {
        navigation?.setOptions({
            headerRight: () => (
                <View style={{ marginRight: 15 }}>
                    <IconSelector
                        value={icon}
                        onChange={setIcon}
                    />
                </View>
            ),
        });
    }, [icon]);

    useEffect(() => {
        navigation?.setOptions({
            headerStyle: {
                backgroundColor: COLORS[color],
            },
        });
    }, [color]);

    function handleCreate() {
        const habit: Habit = {
            id: uuid(),
            name,
            description,
            icon,
            color,
            dailyGoal,
            completionMatrix: {},
            createdAt: DateTime.now().toMillis(),
            updatedAt: DateTime.now().toMillis(),
        };

        const v1 = validate('name', name.length > 0, 'Name is required');

        if (v1) {
            addHabit(habit);
            navigation.navigate('Habits');
            reset();
        }
    }

    return (
        <PageLayout style={{ padding: 10, gap: 10 }}>
            <FormTextField
                label='Name'
                value={name}
                onChange={setName}
                errors={errors.name}
            />

            <FormTextField
                label='Description'
                value={description}
                onChange={setDescription}
                numberOfLines={5}
                multiline
            />

            <DailyGoalControl
                value={dailyGoal}
                setValue={setDailyGoal}
            />

            <Divider style={{ marginTop: 'auto' }} />

            <ColorSelector
                value={color}
                onChange={setColor}
            />

            <Button
                mode='contained'
                style={{ backgroundColor: COLORS[color] }}
                onPress={handleCreate}
                icon={icon}
            >
                Create
            </Button>
        </PageLayout>
    );
}
