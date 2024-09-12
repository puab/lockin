import SectionDivider from '../../components/SectionDivider';
import { StyleSheet, View } from 'react-native';

import PageLayout from '../../components/PageLayout';
import { useAuthContext } from '../../contexts/AuthContext';
import { Text } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
    const { user, setUser } = useAuthContext();

    return (
        <PageLayout style={S.container}>
            <Text>kopsavilkums te</Text>
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
