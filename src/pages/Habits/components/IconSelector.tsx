import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Dialog, Icon, Portal, Text } from 'react-native-paper';
import AppTheme, { ICONS, INPUT_CONTAINER_STYLE } from '../../../Theme';

type IconSelectorProps = {
    value: string;
    onChange: (value: string) => void;
    iconColor?: string;
};

export default function IconSelector({
    value,
    onChange,
    iconColor = 'black',
}: IconSelectorProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setDialogOpen(true)}
                style={[{ padding: 3 }, INPUT_CONTAINER_STYLE]}
            >
                <Icon
                    source={value}
                    size={24}
                    color={iconColor}
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
