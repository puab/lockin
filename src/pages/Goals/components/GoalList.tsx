import { View } from 'react-native';
import { Goal } from '../Types';
import NonIdealState from '../../../components/NonIdealState';
import { Button } from 'react-native-paper';
import DraggableFlatList, {
    ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import * as Haptics from 'expo-haptics';
import GoalItem from './GoalItem';

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

    const renderItem = ({ item, drag }) => (
        <ScaleDecorator>
            <TouchableWithoutFeedback
                onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    drag();
                }}
            >
                <GoalItem
                    goal={item}
                    wantsEdit={() => wantsEdit(item)}
                    wantsDelete={() => wantsDelete(item)}
                />
            </TouchableWithoutFeedback>
        </ScaleDecorator>
    );

    return (
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
    );
}
