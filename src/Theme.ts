import { MD3DarkTheme, MD3Theme } from 'react-native-paper';

const AppTheme: MD3Theme = {
    ...MD3DarkTheme,
    colors: {
        primary: 'rgb(184, 210, 60)',
        onPrimary: 'rgb(43, 52, 0)',
        primaryContainer: 'rgb(64, 76, 0)',
        onPrimaryContainer: 'rgb(212, 239, 87)',
        secondary: 'rgb(248, 190, 7)',
        onSecondary: 'rgb(63, 46, 0)',
        secondaryContainer: 'rgb(90, 67, 0)',
        onSecondaryContainer: 'rgb(255, 223, 155)',
        tertiary: 'rgb(255, 182, 136)',
        onTertiary: 'rgb(81, 36, 0)',
        tertiaryContainer: 'rgb(115, 53, 0)',
        onTertiaryContainer: 'rgb(255, 219, 199)',
        error: 'rgb(255, 180, 171)',
        onError: 'rgb(105, 0, 5)',
        errorContainer: 'rgb(147, 0, 10)',
        onErrorContainer: 'rgb(255, 180, 171)',
        background: 'rgb(27, 28, 23)',
        onBackground: 'rgb(229, 226, 218)',
        surface: 'rgb(27, 28, 23)',
        onSurface: 'rgb(229, 226, 218)',
        surfaceVariant: 'rgb(70, 72, 59)',
        onSurfaceVariant: 'rgb(199, 199, 183)',
        outline: 'rgb(145, 146, 131)',
        outlineVariant: 'rgb(70, 72, 59)',
        shadow: 'rgb(0, 0, 0)',
        scrim: 'rgb(0, 0, 0)',
        inverseSurface: 'rgb(229, 226, 218)',
        inverseOnSurface: 'rgb(48, 49, 43)',
        inversePrimary: 'rgb(86, 101, 0)',
        elevation: {
            level0: 'transparent',
            level1: 'rgb(35, 37, 25)',
            level2: 'rgb(40, 43, 26)',
            level3: 'rgb(44, 48, 27)',
            level4: 'rgb(46, 50, 27)',
            level5: 'rgb(49, 54, 28)',
        },
        surfaceDisabled: 'rgba(229, 226, 218, 0.12)',
        onSurfaceDisabled: 'rgba(229, 226, 218, 0.38)',
        backdrop: 'rgba(48, 49, 38, 0.4)',
    },
};

export default AppTheme;
