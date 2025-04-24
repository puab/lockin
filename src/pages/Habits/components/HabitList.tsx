import { View } from 'react-native';
import HabitItem from './HabitItem';
import { useAppStore } from '../../../store';
import { Habit } from '../Types';
import DraggableFlatList, {
    ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useShallow } from 'zustand/react/shallow';
import { Button } from 'react-native-paper';
import NonIdealState from '../../../components/NonIdealState';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { asyncVibrate, DateNowStr } from '../../../Util';
import ConfettiBoom from '../../../components/ConfettiBoom';

type HabitListProps = {
    habits: Habit[];
    wantsCompletion: (habit: Habit) => void;
    wantsDelete: (habit: Habit) => void;
    wantsEdit: (habit: Habit) => void;
    wantsFakeData: (habit: Habit) => void;
    wantsCreate: () => void;
};

export default function HabitList({
    habits,
    wantsCompletion,
    wantsDelete,
    wantsEdit,
    wantsFakeData,
    wantsCreate,
}: HabitListProps) {
    const overwriteHabits = useAppStore(useShallow(s => s.overwriteHabits));

    const animationRef = useRef<LottieView>(null);
    const [animationCoordinates, setAnimationCoordinates] = useState<
        [number, number]
    >([0, 0]);
    function handleCompletion(item: Habit, x: number, y: number) {
        const countToday = item.completionMatrix[DateNowStr] ?? 0;
        if (countToday === item.dailyGoal) return;

        if (countToday + 1 === item.dailyGoal) {
            setAnimationCoordinates([x, y]);
            animationRef.current?.play();
            asyncVibrate();
        }

        wantsCompletion(item);
    }

    const renderItem = ({ item, drag }) => (
        <ScaleDecorator>
            <TouchableWithoutFeedback
                onLongPress={() => {
                    asyncVibrate();
                    drag();
                }}
            >
                <HabitItem
                    habit={item}
                    wantsCompletion={(x, y) => handleCompletion(item, x, y)}
                    wantsDelete={() => wantsDelete(item)}
                    wantsEdit={() => wantsEdit(item)}
                    wantsFakeData={() => wantsFakeData(item)}
                />
            </TouchableWithoutFeedback>
        </ScaleDecorator>
    );

    return (
        <React.Fragment>
            <View style={{ marginTop: 5 }}>
                {habits?.length === 0 ? (
                    <NonIdealState
                        icon='beaker-question'
                        title='No habits'
                        message='Create a habit to get started'
                    ></NonIdealState>
                ) : (
                    <DraggableFlatList
                        data={habits}
                        onDragEnd={({ data }) => overwriteHabits(data)}
                        renderItem={renderItem}
                        keyExtractor={item => `hi${item.id}`}
                    />
                )}
            </View>

            <ConfettiBoom
                animRef={animationRef}
                coords={animationCoordinates}
            />
        </React.Fragment>
    );
}
