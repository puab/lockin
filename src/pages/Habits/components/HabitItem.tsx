import { ScrollView, StyleSheet, View } from 'react-native';
import { Habit } from '../Types';
import AppTheme, { COLORS } from '../../../Theme';
import { Icon, Text } from 'react-native-paper';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HabitCalendar from './HabitCalendar';
import { DateNow, DateNowStr } from '../../../Util';

type HabitItemProps = {
    habit: Habit;
    wantsCompletion: () => void;
};

export default function HabitItem({ habit, wantsCompletion }: HabitItemProps) {
    const habitHex = COLORS[habit.color];

    const [expandedDesc, setExpandedDesc] = useState<boolean>(false);

    const headerLeft = (
        <View style={S.headerLeft}>
            <View style={S.iconContainer}>
                <Icon
                    source={habit.icon}
                    size={24}
                    color={habitHex}
                />
            </View>
            <View style={S.info}>
                <Text style={{ fontSize: 18 }}>{habit.name}</Text>
                {!!habit.description && (
                    <TouchableOpacity onPress={() => setExpandedDesc(e => !e)}>
                        <Text
                            style={{
                                fontSize: 14,
                                color: 'rgb(175, 175, 175)',
                            }}
                            numberOfLines={!expandedDesc ? 3 : undefined}
                        >
                            {habit.description}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const completionToday = habit[DateNowStr];

    return (
        <View style={[S.container, { borderColor: habitHex }]}>
            <View style={S.header}>
                {headerLeft}

                <TouchableOpacity onPress={wantsCompletion}>
                    <View style={S.completionCorner}>
                        <Text>
                            {completionToday ? completionToday : 0} /{' '}
                            {habit.dailyGoal}
                        </Text>
                        <Icon
                            source={'plus'}
                            color='white'
                            size={24}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                style={{ paddingBottom: 5 }}
            >
                <HabitCalendar habit={habit} />
            </ScrollView>
        </View>
    );
}

const S = StyleSheet.create({
    container: {
        gap: 5,
        padding: 5,
        borderLeftWidth: 3,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        flexShrink: 1,
    },
    completionCorner: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        backgroundColor: AppTheme.colors.primaryContainer,
        paddingLeft: 5,
        borderRadius: 5,
    },
    iconContainer: {
        padding: 5,
    },
    info: {
        justifyContent: 'center',
        paddingBottom: 5,
    },
});
