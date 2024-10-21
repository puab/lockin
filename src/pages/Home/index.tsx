import { StyleSheet } from 'react-native';

import PageLayout from '../../components/PageLayout';
import { useAppContext } from '../../contexts/AppContext';
import TaskBlock from './components/TaskBlock';
import HabitBlock from './components/HabitBlock';

export default function HomeScreen({ navigation }) {
    return (
        <PageLayout style={S.container}>
            <TaskBlock />
            <HabitBlock />
        </PageLayout>
    );
}

const S = StyleSheet.create({
    container: {
        gap: 10,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    section: {
        flex: 1,
    },
});
