import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Dialog, Icon, Portal, Text } from 'react-native-paper';
import AppTheme from '../../../Theme';

type IconSelectorProps = {
    value: string;
    onChange: (value: string) => void;
};

export const ICONS = [
    'dumbbell',
    'chart-line',
    'alarm',
    'food-apple',
    'wallet',
    'heart',
    'coffee',
    'xml',
    'shower',
    'bike',
    'currency-usd',
    'book',
    'heart-flash',
    'walk',
    'controller-classic',
    'leaf',
    'snowflake',
    'text',
];

export default function IconSelector({ value, onChange }: IconSelectorProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <>
            <TouchableOpacity onPress={() => setDialogOpen(true)}>
                <Icon
                    source={value}
                    size={24}
                    color='black'
                />
            </TouchableOpacity>
            <Portal>
                <Dialog
                    visible={dialogOpen}
                    onDismiss={() => setDialogOpen(false)}
                >
                    <Dialog.Title>Icon</Dialog.Title>
                    <Dialog.Content style={S.optionsContainer}>
                        {ICONS.map((i, idx) => (
                            <IconOption
                                key={`io${idx}`}
                                icon={i}
                                onPress={() => onChange(i)}
                                active={value == i}
                            />
                        ))}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogOpen(false)}>
                            Done
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

type IconOptionProps = {
    icon: string;
    onPress: () => void;
    active: boolean;
};

function IconOption({ icon, onPress, active }: IconOptionProps) {
    return (
        <TouchableOpacity
            style={[S.option, active && S.activeOption]}
            onPress={onPress}
        >
            <Icon
                source={icon}
                size={24}
                color={active ? AppTheme.colors.primary : 'white'}
            />
        </TouchableOpacity>
    );
}

const S = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'row',
        gap: 5,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    option: {
        padding: 5,
        backgroundColor: AppTheme.colors.inverseOnSurface,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeOption: {
        borderColor: AppTheme.colors.primary,
    },
});
