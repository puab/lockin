import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppTheme from '../../../Theme';
import { Icon, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateNowStr } from '../../../Util';
import { DateTime } from 'luxon';
import { useAppStore } from '../../../store';

export default function TaskBlock() {
    const tasksToday = useAppStore(s => s.tasks).filter(
        t => t.date === DateNowStr
    );
    const nav = useNavigation<NativeStackNavigationProp<any>>();

    function goToTasks() {
        nav.navigate('Tasklist', { currentDateMs: DateTime.now().toMillis() });
    }

    const completedCount = tasksToday.filter(t => t.completed).length;

    return (
        <View style={S.container}>
            <TouchableOpacity
                onPress={goToTasks}
                style={S.inner}
            >
                <Text style={S.text}>Tasks</Text>
                <View style={S.right}>
                    {tasksToday.length > 0 && (
                        <Text style={S.text}>
                            {completedCount} / {tasksToday.length}
                        </Text>
                    )}
                    <Icon
                        source={'menu-right'}
                        size={36}
                        color={AppTheme.colors.primary}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const S = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: AppTheme.colors.inverseOnSurface,

        borderRadius: 10,
    },
    inner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    right: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    text: { color: AppTheme.colors.primary, fontSize: 18, fontWeight: 'bold' },
});
