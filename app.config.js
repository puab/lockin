module.export = {
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
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
    },
    web: {
        favicon: './assets/favicon.png',
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
};
