import { StyleSheet, View } from 'react-native';
import { COLORS } from '../Theme';
import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

type ColorSelectorProps = {
    value: string;
    onChange: (c: string) => void;
};

export default function ColorSelector({ value, onChange }: ColorSelectorProps) {
    return (
        <View style={S.container}>
            {Object.entries(COLORS).map(([val, hex], idx) => {
                const selected = val === value;

                return (
                    <TouchableOpacity
                        onPress={() => onChange(val)}
                        key={`cc${idx}`}
                    >
                        <View
                            style={[
                                S.cell,
                                { backgroundColor: hex },
                                selected && S.cellSelected,
                            ]}
                        ></View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const S = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 5,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    cell: {
        aspectRatio: '1 / 1',
        width: 25,
    },
    cellSelected: {
        elevation: 10,
    },
});
