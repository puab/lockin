import { View } from 'react-native';
import { Goal } from '../Types';
import NonIdealState from '../../../components/NonIdealState';
import { Button, Menu } from 'react-native-paper';
import DraggableFlatList, {
    ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import GoalItem from './GoalItem';
import { useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import ConfettiBoom from '../../../components/ConfettiBoom';
import { asyncVibrate } from '../../../Util';

type GoalListProps = {
    goals: Goal[];
    wantsCreate: () => void;
    wantsEdit: (goal: Goal) => void;
    wantsDelete: (goal: Goal) => void;
    nonIdealTitle: string;
    nonIdealMessage: string;
};

export default function GoalList({
    goals,
    wantsCreate,
    wantsEdit,
    wantsDelete,
    nonIdealTitle,
    nonIdealMessage,
}: GoalListProps) {
    const overwriteGoals = useAppStore(useShallow(s => s.overwriteGoals));
    const toggleGoalCompletion = useAppStore(
        useShallow(s => s.toggleGoalCompletion)
    );

    const animationRef = useRef<LottieView>(null);
    const [animationCoordinates, setAnimationCoordinates] = useState<
        [number, number]
    >([0, 0]);
    function handleComplete(goal: Goal, x: number, y: number) {
        if (!goal.completed) {
            setAnimationCoordinates([x, y]);
            animationRef.current?.play();
            asyncVibrate();
        }
        toggleGoalCompletion(goal);
    }

    const [menuItem, setMenuItem] = useState<Goal | null>(null);
    const [menuCoordinates, setMenuCoordinates] = useState<[number, number]>([
        0, 0,
    ]);

    function wantsMenu(goal: Goal, x: number, y: number) {
        setMenuItem(goal);
        setMenuCoordinates([x, y]);
    }

    const renderItem = ({ item, drag }) => (
        <ScaleDecorator>
            <TouchableWithoutFeedback
                onLongPress={() => {
                    asyncVibrate();
                    drag();
                }}
            >
                <GoalItem
                    goal={item}
                    wantsMenu={(x, y) => wantsMenu(item, x, y)}
                    wantsComplete={(x, y) => handleComplete(item, x, y)}
                />
            </TouchableWithoutFeedback>
        </ScaleDecorator>
    );

    return (
        <>
            <View style={{ marginTop: 10 }}>
                {goals?.length === 0 ? (
                    <NonIdealState
                        icon='crosshairs-question'
                        title={nonIdealTitle}
                        message={nonIdealMessage}
                    >
                        <Button
                            style={{ marginRight: 15 }}
                            mode='contained'
                            icon={'plus'}
                            onPress={() => wantsCreate()}
                        >
                            Create
                        </Button>
                    </NonIdealState>
                ) : (
                    <DraggableFlatList
                        data={goals}
                        onDragEnd={({ data }) => overwriteGoals(data)}
                        renderItem={renderItem}
                        keyExtractor={item => `hi${item.id}`}
                    />
                )}
            </View>

            <ConfettiBoom
                animRef={animationRef}
                coords={animationCoordinates}
            />

            <Menu
                visible={!!menuItem}
                onDismiss={() => setMenuItem(null)}
                mode='elevated'
                anchorPosition='bottom'
                anchor={{ x: menuCoordinates[0], y: menuCoordinates[1] }}
            >
                <Menu.Item
                    onPress={() => {
                        setMenuItem(null);
                        wantsEdit(menuItem as Goal);
                    }}
                    title='Edit'
                    leadingIcon='pencil'
                />
                <Menu.Item
                    onPress={() => {
                        setMenuItem(null);
                        wantsDelete(menuItem as Goal);
                    }}
                    title='Delete'
                    leadingIcon='delete'
                    titleStyle={{ color: 'red' }}
                    theme={{ colors: { onSurfaceVariant: 'red' } }}
                />
            </Menu>
        </>
    );
}
