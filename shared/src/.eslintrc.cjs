module.exports = {
  root: false,
  extends: ['../../.eslintrc.yml'],
  parserOptions: {
    project: ['../tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['../tsconfig.eslint.json'],
      },
    },
  },
}
