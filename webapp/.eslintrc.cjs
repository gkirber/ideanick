module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.app.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'import', 'node'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.app.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  rules: {
    'no-console': ['error', { allow: ['info', 'error', 'warn'] }],
    'node/no-process-env': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@ideanick/backend/**',
              '!@ideanick/backend/**/',
              '!@ideanick/backend/**/input',
              '!@ideanick/backend/src/utils/can',
            ],
            allowTypeImports: true,
            message: 'Only types and input schemas are allowed to be imported from backend workspace',
          },
        ],
      },
    ],
  },
}
