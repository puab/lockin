import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

export default function useSheetBack(
    open: boolean,
    setOpen: (open: boolean) => void
) {
    return useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (open) {
                    setOpen(false);
                    return true;
                } else {
                    return false;
                }
            };

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            return () => subscription.remove();
        }, [open])
    );
}
