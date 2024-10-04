import { Vibration, View } from 'react-native';
import HabitItem from './HabitItem';
import { useAppStore } from '../../../store';
import { Habit } from '../Types';
import DraggableFlatList, {
    ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useShallow } from 'zustand/react/shallow';
import { Button, Text } from 'react-native-paper';
import NonIdealState from '../../../components/NonIdealState';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

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

    const renderItem = ({ item, drag }) => (
        <ScaleDecorator>
            <TouchableWithoutFeedback
                onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    drag();
                }}
            >
                <HabitItem
                    habit={item}
                    wantsCompletion={() => wantsCompletion(item)}
                    wantsDelete={() => wantsDelete(item)}
                    wantsEdit={() => wantsEdit(item)}
                    wantsFakeData={() => wantsFakeData(item)}
                />
            </TouchableWithoutFeedback>
        </ScaleDecorator>
    );

    return (
        <View style={{ marginTop: 5 }}>
            {habits?.length === 0 ? (
                <NonIdealState
                    icon='beaker-question'
                    title='No habits'
                    message='Create a habit to get started'
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
                    data={habits}
                    onDragEnd={({ data }) => overwriteHabits(data)}
                    renderItem={renderItem}
                    keyExtractor={item => `hi${item.id}`}
                />
            )}
        </View>
    );
}
