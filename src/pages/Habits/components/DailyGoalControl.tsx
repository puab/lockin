import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FormTextField from '../../../components/FormTextField';
import { Icon } from 'react-native-paper';
import AppTheme from '../../../Theme';

type DailyGoalControlProps = {
    value: number;
    setValue: (value: any) => void;
};

export default function DailyGoalControl({
    value,
    setValue,
}: DailyGoalControlProps) {
    return (
        <View style={S.dailyGoalContainer}>
            <FormTextField
                label='Goal'
                value={`${value.toString()} / day`}
                style={{ flexGrow: 1 }}
                editable={false}
            />

            <View style={S.dailyGoalControls}>
                <TouchableOpacity
                    style={S.dailyGoalControl}
                    onPress={() => setValue(g => g + 1)}
                >
                    <Icon
                        source={'plus'}
                        size={24}
                        color={AppTheme.colors.inverseSurface}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={S.dailyGoalControl}
                    onPress={() => setValue(g => (g > 1 ? g - 1 : g))}
                >
                    <Icon
                        source={'minus'}
                        size={24}
                        color={AppTheme.colors.inverseSurface}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const S = StyleSheet.create({
    dailyGoalContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    dailyGoalControls: {
        justifyContent: 'center',
        gap: 5,
    },
    dailyGoalControl: {
        color: 'white',
        flex: 1,
    },
});
