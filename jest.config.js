export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/tests/playwright/'
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    },
};