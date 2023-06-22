var tsConfigs = ['./tsconfig.json'];
var tsConfigEmail = ['./tsconfig-emails.json'];

var ruleOverrides = {};

module.exports = {
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@next/next/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsConfigs,
      },
      plugins: ['@typescript-eslint', 'prettier'],
      rules: {
        'prettier/prettier': 1,
      },
      files: ['src/**/*.ts', 'src/**/*.tsx'],
    },
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@next/next/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsConfigEmail,
      },
      plugins: ['@typescript-eslint', 'prettier'],
      rules: {
        'prettier/prettier': 1,
      },
      files: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'emails/**/*.ts',
        'emails/**/*.tsx',
      ],
    },
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsConfigs,
      },
      plugins: [
        '@typescript-eslint',
        'plugin:playwright/playwright-test',
        'prettier',
      ],
      rules: {
        'prettier/prettier': 'error',
      },
      files: ['e2e/**/*.spec.ts'],
    },
    {
      extends: ['eslint:recommended', 'prettier', 'esnext'],
      files: '*.mjs',
      rules: ruleOverrides,
    },
    {
      extends: ['prettier'],
      files: '*.js',
      rules: ruleOverrides,
    },
  ],
  root: true,
};
