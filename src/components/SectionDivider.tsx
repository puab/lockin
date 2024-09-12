import { StyleSheet, View } from 'react-native';
export default function SectionDivider() {
    return (
        <View>
            <View style={S.divider}></View>
        </View>
    );
}

const S = StyleSheet.create({
    divider: {
        width: '90%',
        height: 1,
        marginVertical: 5,
        marginHorizontal: 'auto',
    },
});
