module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*(\\.|/)(test|spec)|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^tests/(.*)$': '<rootDir>/src/__tests__/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^lib': '<rootDir>/src/lib/',
  },
}
