module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*(\\.|/)(test|spec)|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  clearMocks: true,
  moduleNameMapper: {
    '^__mocks__/(.*)$': '<rootDir>/src/__mocks__/$1',
    '^__tests__/(.*)$': '<rootDir>/src/__tests__/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^functions/(.*)$': '<rootDir>/src/functions/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^datasources/(.*)$': '<rootDir>/src/datasources/$1',
    '^models/(.*)$': '<rootDir>/src/models/$1',
    '^lib': '<rootDir>/src/lib/',
    '^types/(.*)$': '<rootDir>/src/types/$1',
  },
}
