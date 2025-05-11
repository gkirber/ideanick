import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'
import love from 'eslint-config-love'
import prettier from 'eslint-config-prettier'
import nodePlugin from 'eslint-plugin-node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...love,
    ...prettier,
  },
  {
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2022,
    },
    plugins: {
      node: nodePlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],
      'node/no-process-env': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: '[object.type=MetaProperty][property.name="env"]',
          message: 'Use instead import { env } from "lib/env"',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      curly: ['error', 'all'],
      'no-irregular-whitespace': [
        'error',
        {
          skipTemplates: true,
          skipStrings: true,
        },
      ],
      'no-console': ['error', { allow: ['info', 'error', 'warn'] }],
    },
  },
]
