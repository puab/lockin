import { useState } from 'react';
import { WEEKDAYS } from '../../../Util';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { HelperText, Text } from 'react-native-paper';
import AppTheme from '../../../Theme';

type WeekdaySelectorProps = {
    value: number[];
    onChange: (selected: number[]) => void;
    errors?: string[];
};

export default function WeekdaySelector({
    value,
    onChange,
    errors,
}: WeekdaySelectorProps) {
    function toggle(dayNr: number) {
        if (value.includes(dayNr)) {
            onChange(value.filter(d => d !== dayNr));
        } else {
            onChange([...value, dayNr]);
        }
    }

    return (
        <>
            <View style={S.container}>
                {WEEKDAYS.map(dayNr => {
                    const selected = value.includes(dayNr);

                    return (
                        <TouchableOpacity
                            key={`wsi-${dayNr}`}
                            style={[S.cell, selected && S.cellSelected]}
                            onPress={() => toggle(dayNr)}
                        >
                            <Text style={[selected && S.cellTextSelected]}>
                                {dayNr}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {errors?.map((err, idx) => (
                <HelperText
                    type='error'
                    visible={true}
                    key={`wserr${idx}`}
                >
                    {err}
                </HelperText>
            ))}
        </>
    );
}

const S = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 5,
    },
    cell: {
        borderRadius: 3,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppTheme.colors.inverseOnSurface,
        flex: 1,
        borderWidth: 1,
        borderColor: AppTheme.colors.outline,
    },
    cellSelected: {
        backgroundColor: AppTheme.colors.primaryContainer,
    },
    cellTextSelected: {
        color: AppTheme.colors.primary,
        fontWeight: 'bold',
    },
});
