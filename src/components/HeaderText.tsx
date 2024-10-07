import { StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';

type HeaderTextProps = {
    style?: TextStyle;
    children: any;
};

export default function HeaderText({ style, children }: HeaderTextProps) {
    return <Text style={[S.text, style]}>{children}</Text>;
}

const S = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
