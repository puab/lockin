import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../../contexts/AppContext';
import AppTheme from '../../../Theme';
import { Icon, Text } from 'react-native-paper';
import { Task } from '../../Tasks/Types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateNow, pluralize } from '../../../Util';
import { DateTime } from 'luxon';
import Block from './Block';

export default function TaskBlock() {
    const tasksToday = useAppContext<Task[]>(s => s.tasks).filter(
        t => t.date === DateNow.toFormat('yyyy-LL-dd')
    );
    const nav = useNavigation<NativeStackNavigationProp<any>>();

    async function goToTasks() {
        nav.navigate('Tasklist', { currentDateMs: DateTime.now().toMillis() });
    }

    const completedCount = tasksToday.filter(t => t.completed).length;

    return (
        <Block
            style={S.container}
            onPress={goToTasks}
        >
            <Text style={S.text}>
                {tasksToday.length > 0 ? `${tasksToday.length}` : `No`}{' '}
                {pluralize(tasksToday.length, 'task', 's')} today
            </Text>
            <View style={S.right}>
                {tasksToday.length > 0 && (
                    <Text style={S.text}>
                        {completedCount} / {tasksToday.length}
                    </Text>
                )}
                <Icon
                    source={'menu-right'}
                    size={48}
                    color={AppTheme.colors.primary}
                />
            </View>
        </Block>
    );
}

const S = StyleSheet.create({
    container: {
        padding: 5,
        paddingLeft: 15,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
    },
    right: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    text: { color: AppTheme.colors.primary, fontSize: 18 },
});
