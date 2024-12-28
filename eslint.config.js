import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import mocha from 'eslint-plugin-mocha';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    rules: {
      ...js.configs.recommended.rules,
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
