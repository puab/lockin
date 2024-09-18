import { Fold } from 'react-native-animated-spinkit';
import AppTheme from '../Theme';
import { StyleSheet } from 'react-native';

export default function LoaderPlaceholder() {
    return (
        <Fold
            size={50}
            color={AppTheme.colors.primary}
            style={S.loader}
        />
    );
}

const S = StyleSheet.create({
    loader: {
        margin: 'auto',
    },
});
