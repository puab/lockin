import { View } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { Text } from 'react-native-paper';

export default function HabitScreen() {
    return (
        <PageLayout style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>habits</Text>
        </PageLayout>
    );
}
