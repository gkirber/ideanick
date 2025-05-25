/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  passWithNoTests: true,
  verbose: true,
  prettierPath: null,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^superjson$': '<rootDir>/src/test/mocks/superjson.ts',
    '^@ideanick/webapp/src/lib/routes$': '<rootDir>/src/test/mocks/routes.ts',
  },
}
