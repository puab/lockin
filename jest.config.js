/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: 'jest-expo',
    transform: {
        '^.+\\.jsx$': 'babel-jest',
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.jest.json',
            },
        ],
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!(jest-)?react-native|@react-native|expo-modules-core|expo|uuid|react-native-gesture-handler)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
