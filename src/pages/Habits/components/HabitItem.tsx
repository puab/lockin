import { FlatListComponent, ScrollView, StyleSheet, View } from 'react-native';
import { Habit } from '../Types';
import AppTheme, { COLORS } from '../../../Theme';
import { Icon, Menu, Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import {
    Gesture,
    GestureDetector,
    TouchableOpacity,
} from 'react-native-gesture-handler';
import HabitCalendar from './HabitCalendar';
import { DateNow, DateNowStr } from '../../../Util';

type HabitItemProps = {
    habit: Habit;
    wantsCompletion: () => void;
    wantsEdit: () => void;
    wantsDelete: () => void;
    wantsFakeData: () => void;
};

export default function HabitItem({
    habit,
    wantsCompletion,
    wantsEdit,
    wantsDelete,
    wantsFakeData,
}: HabitItemProps) {
    const habitHex = COLORS[habit.color];

    const [expandedDesc, setExpandedDesc] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [busy, setBusy] = useState<boolean>(false);

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

    const countToday = habit.completionMatrix[DateNowStr] ?? 0;

    const longPress = Gesture.LongPress()
        .runOnJS(true)
        .onStart(() => setMenuOpen(true));

    const el = (
        <GestureDetector gesture={longPress}>
            <View style={[S.container, { borderColor: habitHex }]}>
                <View style={S.header}>
                    {headerLeft}

                    <TouchableOpacity onPress={wantsCompletion}>
                        <View style={S.completionCorner}>
                            <Text>
                                {countToday} / {habit.dailyGoal}
                            </Text>
                            <Icon
                                source={
                                    countToday == habit.dailyGoal
                                        ? 'check'
                                        : 'plus'
                                }
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
        </GestureDetector>
    );

    return (
        <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            mode='elevated'
            anchorPosition='bottom'
            anchor={el}
            style={{ marginLeft: 50, marginTop: '-25%' }}
        >
            <Menu.Item
                onPress={() => {
                    setMenuOpen(false);
                    wantsEdit();
                }}
                title='Edit'
                leadingIcon='pencil'
            />
            <Menu.Item
                onPress={() => {
                    setMenuOpen(false);
                    wantsDelete();
                }}
                title='Delete'
                leadingIcon='delete'
                titleStyle={{ color: 'red' }}
                theme={{ colors: { onSurfaceVariant: 'red' } }}
            />
            <Menu.Item
                onPress={() => {
                    setMenuOpen(false);
                    wantsFakeData();
                }}
                title='Generate fake data'
                leadingIcon='data-matrix'
            />
        </Menu>
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
