import { StyleSheet } from 'react-native';
import PageLayout from '../../components/PageLayout';
import { DateNow } from '../../Util';
import DateRow from './components/DateRow';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { FAB } from 'react-native-paper';
import { useAuthContext } from '../../contexts/AuthContext';

export default function TasksScreen() {
    const { nav } = useAuthContext();

    const [curDate, setCurDate] = useState<DateTime>(DateNow);

    return (
        <PageLayout style={S.page}>
            <DateRow
                selected={curDate}
                onChange={d => setCurDate(d)}
            />

            <FAB
                icon={'plus'}
                style={S.fab}
                onPress={() => nav?.navigate('New task')}
            />
        </PageLayout>
    );
}

const S = StyleSheet.create({
    page: { padding: 5 },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
});
