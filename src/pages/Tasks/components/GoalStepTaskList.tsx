import { DateTime } from 'luxon';
import { GoalStepTask } from '../../Goals/Types';
import { FlatList } from 'react-native-gesture-handler';
import GoalStepTaskEntry from './GoalStepTaskEntry';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppStore } from '../../../store';
import { useShallow } from 'zustand/react/shallow';
import ConfettiBoom from '../../../components/ConfettiBoom';
import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';
import { asyncVibrate } from '../../../Util';

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

    const toggleGoalStepCompletion = useAppStore(
        useShallow(s => s.toggleGoalStepCompletion)
    );

    const animationRef = useRef<LottieView>(null);
    const [animationCoordinates, setAnimationCoordinates] = useState<
        [number, number]
    >([0, 0]);
    function handleComplete(item: GoalStepTask, x: number, y: number) {
        if (!item.completedDates?.includes(activeDate.toFormat('yyyy-LL-dd'))) {
            setAnimationCoordinates([x, y]);
            animationRef.current?.play();
            asyncVibrate();
        }

        toggleGoalStepCompletion(item, activeDate.toFormat('yyyy-LL-dd'));
    }

    return (
        <>
            <FlatList
                data={steps}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <GoalStepTaskEntry
                        step={item}
                        activeDateStr={activeDate.toFormat('yyyy-LL-dd')}
                        wantsSeeGoal={wantsSeeGoal}
                        wantsComplete={(x, y) => handleComplete(item, x, y)}
                    />
                )}
            />
            <ConfettiBoom
                animRef={animationRef}
                coords={animationCoordinates}
            />
        </>
    );
}
