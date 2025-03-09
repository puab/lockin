module.exports = {
    name: 'Organizo',
    slug: 'organizo',

    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/organizo.png',
    userInterfaceStyle: 'dark',
    entryPoint: './App.tsx',
    notification: {
        icon: './assets/organizo.png',
    },
    splash: {
        image: './assets/organizo.png',
        resizeMode: 'contain',
        backgroundColor: '#000000',
    },
    ios: {
        supportsTablet: true,
    },
    android: {
        package: 'com.puab.organizo',
        adaptiveIcon: {
            foregroundImage: './assets/organizo.png',
        },
    },
    web: {
        favicon: './assets/organizo.png',
    },
    plugins: [
        [
            'expo-notifications',
            {
                icon: './assets/organizo.png',
            },
        ],
    ],
    extra: {
        eas: {
            projectId: 'aa14deef-8611-4fea-91d9-f20dd6589aa0',
        },
    },
};
