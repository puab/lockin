import { DateTime } from 'luxon';
import { GoalStepTask } from '../../Goals/Types';
import { FlatList } from 'react-native-gesture-handler';
import GoalStepTaskEntry from './GoalStepTaskEntry';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type GoalStepTaskListProps = {
    activeDate: DateTime;
    steps: GoalStepTask[];
};

export default function GoalStepTaskList({
    activeDate,
    steps,
}: GoalStepTaskListProps) {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    function wantsSeeGoal() {
        navigation.navigate('Goals');
    }

    return (
        <FlatList
            data={steps}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <GoalStepTaskEntry
                    step={item}
                    activeDateStr={activeDate.toFormat('yyyy-LL-dd')}
                    wantsSeeGoal={wantsSeeGoal}
                />
            )}
        />
    );
}
