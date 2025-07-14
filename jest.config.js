const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    // Use default testMatch patterns from Jest to detect .test and .spec files
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/core/(.*)$': '<rootDir>/src/core/$1',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
        '^next-auth/react$': '<rootDir>/__mocks__/next-auth-react.js',
        '^next/navigation$': '<rootDir>/__mocks__/next-navigation.js',
    },
};

module.exports = createJestConfig(customJestConfig);
