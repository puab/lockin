import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Habit } from '../Types';
import AppTheme, { COLORS } from '../../../Theme';
import { Icon, Menu, Text } from 'react-native-paper';
import { useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import HabitCalendar from './HabitCalendar';
import { DateNowStr } from '../../../Util';

type HabitItemProps = {
    habit: Habit;
    wantsCompletion: (x: number, y: number) => void;
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

    const tap = Gesture.Tap()
        .runOnJS(true)
        .onStart(() => setMenuOpen(true));

    const el = (
        <View style={[S.container, { borderColor: habitHex }]}>
            <View style={S.header}>
                <GestureDetector gesture={tap}>{headerLeft}</GestureDetector>

                <TouchableOpacity
                    onPress={evt =>
                        wantsCompletion(
                            evt.nativeEvent.pageX,
                            evt.nativeEvent.pageY
                        )
                    }
                >
                    <View style={S.completionCorner}>
                        <Text>
                            {countToday} / {habit.dailyGoal}
                        </Text>
                        <Icon
                            source={
                                countToday == habit.dailyGoal ? 'check' : 'plus'
                            }
                            color='white'
                            size={24}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <HabitCalendar habit={habit} />
        </View>
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
        marginBottom: 10,
        marginHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        flexShrink: 1,
        flexGrow: 1,
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
