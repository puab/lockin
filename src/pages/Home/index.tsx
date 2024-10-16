import { StyleSheet, View } from 'react-native';

import PageLayout from '../../components/PageLayout';
import { useAppContext } from '../../contexts/AppContext';
import TaskBlock from './components/TaskBlock';
import HabitBlock from './components/HabitBlock';

export default function HomeScreen({ navigation }) {
    const user = useAppContext(s => s.user);

    return (
        <PageLayout style={S.container}>
            <TaskBlock />
            <HabitBlock />
        </PageLayout>
    );
}

const S = StyleSheet.create({
    container: {
        padding: 5,
        gap: 10,
        paddingHorizontal: 15,
    },
    section: {
        flex: 1,
    },
});
