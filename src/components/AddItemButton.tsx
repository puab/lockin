import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

export default function AddItemButton({ onPress }) {
    return (
        <FAB
            icon={'plus'}
            style={S.fab}
            onPress={onPress}
        />
    );
}

const S = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1,
    },
});
