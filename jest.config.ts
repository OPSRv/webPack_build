import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',

    transform: {
        '^.+\\.tsx?$': 'babel-jest',
    },

    testMatch: [
        '<rootDir>/src/**/*.test.{ts,tsx}',
        '<rootDir>/src/**/*.spec.{ts,tsx}',
    ],

    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
        '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    },

    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/index.tsx',
    ],

    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};

export default config;
