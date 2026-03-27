const path = require('path');

module.exports = {
  displayName: 'Booking GraphQL Backend',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    path.resolve(__dirname, 'src')
  ],
  testMatch: [
    '**/__tests__/**/*.spec.ts',
    '**/__tests__/**/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'json', 'ts'],
  verbose: true,
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};
