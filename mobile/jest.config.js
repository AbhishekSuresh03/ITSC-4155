module.exports = {
    preset: '@testing-library/react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    setupFilesAfterEnv: ['./jest-setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|react-native-elements|react-native-size-matters|react-native-ratings|react-native-maps)/)',
    ],
};