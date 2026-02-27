import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'tests/cypress/**/*.cy.{js,jsx}',
    supportFile: false,
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx}',
    supportFile: false,
  },
});
