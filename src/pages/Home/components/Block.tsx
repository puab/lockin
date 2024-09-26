import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

type BlockProps = {
    children?: any;
    onPress?: () => void;
    style?: ViewStyle;
};

export default function Block({ children, onPress, style }: BlockProps) {
    return (
        <TouchableOpacity
            style={style}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
}

const S = StyleSheet.create({});
