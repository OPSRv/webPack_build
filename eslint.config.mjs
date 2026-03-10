import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import security from 'eslint-plugin-security';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    // Strict TS
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    // Security
    security.configs.recommended,
    // Accessibility
    jsxA11y.flatConfigs.recommended,
    prettierConfig,
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'simple-import-sort': simpleImportSort,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: { jsx: true },
                projectService: true,
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // React
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // Strict TS
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

            // Performance
            'react/jsx-no-bind': ['warn', { allowArrowFunctions: true, allowFunctions: false }],
            'no-console': 'warn',

            // Style
            'nonblock-statement-body-position': ['error', 'beside'],
            'curly': ['error', 'all'],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' },
            ],

            // Imports
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    {
        ignores: ['dist/', 'coverage/', 'node_modules/', 'config/'],
    },
];
