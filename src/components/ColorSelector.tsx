import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '../Theme';
import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMemo } from 'react';

type ColorSelectorProps = {
    value: string;
    onChange: (c: string) => void;
    style?: ViewStyle;
};

export default function ColorSelector({
    value,
    onChange,
    style,
}: ColorSelectorProps) {
    return useMemo(
        () => (
            <View style={[S.container, style]}>
                {Object.entries(COLORS).map(([val, hex], idx) => {
                    const selected = val === value;

                    return (
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                onChange(val);
                            }}
                            key={`cc${idx}`}
                        >
                            <View style={[S.cell, { backgroundColor: hex }]}>
                                {selected && (
                                    <View style={S.selectedTick}></View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        ),
        [value]
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
        borderRadius: 5,
    },
    selectedTick: {
        margin: 'auto',
        height: '35%',
        aspectRatio: '1 / 1',
        backgroundColor: 'black',
        borderRadius: 3,
    },
});
