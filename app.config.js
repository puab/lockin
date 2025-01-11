module.exports = {
    name: 'organizo',
    slug: 'organizo',

    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/lockin.png',
    userInterfaceStyle: 'dark',
    entryPoint: './src/App.tsx',
    notification: {
        icon: './assets/lockin.png',
        color: '#ff0000',
    },
    splash: {
        image: './assets/lockin.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    ios: {
        supportsTablet: true,
    },
    android: {
        package: 'com.puab.organizo',
        adaptiveIcon: {
            foregroundImage: './assets/lockin.png',
            backgroundColor: '#ffffff',
        },
    },
    web: {
        favicon: './assets/lockin.png',
    },
    plugins: [
        [
            'expo-notifications',
            {
                icon: './assets/lockin.png',
                color: '#ff0000',
            },
        ],
    ],
    extra: {
        eas: {
            projectId: 'aa14deef-8611-4fea-91d9-f20dd6589aa0',
        },
    },
};
