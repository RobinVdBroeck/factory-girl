import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import mocha from 'eslint-plugin-mocha';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'import/order': 'error',
      ...prettierConfig.rules,
    },
  },
  {
    files: ['test/**/*.js'],
    ...mocha.configs.flat.recommended,
    rules: {
      ...mocha.configs.flat.recommended.rules,
      'mocha/no-setup-in-describe': 'off',
    },
  },
];
