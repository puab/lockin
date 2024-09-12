import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import AppTheme from '../Theme';

type PageLayoutProps = {
    children: any;
    style?: any;
};
export default function PageLayout({ children, style }: PageLayoutProps) {
    return (
        <SafeAreaView
            style={[
                S.layout,
                { backgroundColor: AppTheme.colors.background },
                style,
            ]}
        >
            {children}
        </SafeAreaView>
    );
}

const S = StyleSheet.create({
    layout: {
        flex: 1,
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
