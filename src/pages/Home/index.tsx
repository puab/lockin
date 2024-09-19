import SectionDivider from '../../components/SectionDivider';
import { StyleSheet, View } from 'react-native';

import PageLayout from '../../components/PageLayout';
import { Text } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';
import TaskBlock from './components/TaskBlock';

export default function HomeScreen({ navigation }) {
    const user = useAppContext(s => s.user);

    return (
        <PageLayout style={S.container}>
            <TaskBlock />
        </PageLayout>
    );
}

const S = StyleSheet.create({
    container: {
        padding: 5,
    },
    section: {
        flex: 1,
    },
});
