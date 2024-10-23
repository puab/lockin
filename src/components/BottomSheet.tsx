import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import AppTheme from '../Theme';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

type BottomSheetProps = {
    open: boolean;
    setOpen: (val: boolean) => void;
    children?: any;
    handleColor?: string;
    onDismiss?: () => void;
};

export default function BottomSheet({
    open,
    setOpen,
    children,
    handleColor,
    onDismiss,
}: BottomSheetProps) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [open]);

    return (
        <BottomSheetModal
            snapPoints={['85%']}
            enablePanDownToClose={true}
            ref={bottomSheetRef}
            onChange={index => index === -1 && setOpen(false)}
            onDismiss={() => {
                setOpen(false);
                if (onDismiss) {
                    onDismiss();
                }
            }}
            handleIndicatorStyle={{
                backgroundColor: handleColor ?? AppTheme.colors.primary,
            }}
            backgroundStyle={{
                backgroundColor: AppTheme.colors.inverseOnSurface,
            }}
            backdropComponent={props => (
                <BottomSheetBackdrop
                    {...props}
                    opacity={0.75}
                    enableTouchThrough={false}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    style={[
                        { backgroundColor: 'rgba(0, 0, 0, 1)' },
                        StyleSheet.absoluteFillObject,
                    ]}
                />
            )}
        >
            <KeyboardAvoidingView
                style={S.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {children}
            </KeyboardAvoidingView>
        </BottomSheetModal>
    );
}

const S = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingBottom: 10,
        gap: 10,
    },
});
