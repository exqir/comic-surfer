module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*(\\.|/)(test|spec)|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^__mocks__/(.*)$': '<rootDir>/src/__mocks__/$1',
    '^tests/(.*)$': '<rootDir>/src/__tests__/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^datasources/(.*)$': '<rootDir>/src/datasources/$1',
    '^lib': '<rootDir>/src/lib/',
    '^types/server-schema': '<rootDir>/src/types/graphql-server-schema.ts',
  },
}
