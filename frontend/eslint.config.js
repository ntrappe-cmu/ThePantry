import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'tests']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: { react: react, },
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      "indent": ["warn", 2],
      "no-unused-vars": "warn",      // Don't fail build for unused variables
      "no-console": "off",           // Allow console.log for debugging
      "react/prop-types": "off",     // Turn off prop-types (common in weak setups)
      "react-hooks/rules-of-hooks": "error", // Keep this as error (it breaks React)
      "react-hooks/exhaustive-deps": "warn",  // Only warn about dependency arrays
      "react/jsx-indent": ["warn", 2],
      "react/jsx-indent-props": ["warn", 2],
    },
    settings: {
      react: {
        version: "detect"
      },
    },
  },
])
