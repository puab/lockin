import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

type NonIdealStateProps = {
    icon: string;
    title: string;
    message: string;
    children?: any;
};

export default function NonIdealState({
    icon,
    title,
    message,
    children,
}: NonIdealStateProps) {
    return (
        <View style={S.container}>
            <Icon
                source={icon}
                size={48}
            />
            <Text style={{ fontSize: 28, textAlign: 'center' }}>{title}</Text>
            <Text style={{ marginBottom: 10, textAlign: 'center' }}>
                {message}
            </Text>
            <View>{children}</View>
        </View>
    );
}

const S = StyleSheet.create({
    container: {
        paddingHorizontal: 50,
        alignItems: 'center',
        marginTop: 50,
    },
});
