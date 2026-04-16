import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
        ...globals.jest,
      },
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'warn',

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^node:', '^@?\\w'],

            ['\\.\\./config'],

            ['\\.\\./dtos'],
            ['\\.\\./models'],
            ['\\.\\./services'],

            ['\\.\\./middlewares'],
            ['\\.\\./routes'],
            ['\\.\\./controllers'],

            ['\\.\\./utils'],

            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

            ['^\\./'],

            ['^\\u0000'],
          ],
        },
      ],

      'simple-import-sort/exports': 'warn',
    },
    ignores: ['node_modules/', 'logs/', 'dist/', 'coverage/'],
  },
]);
