import { defineConfig } from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', webpackPreprocessor({
        webpackOptions: {
          resolve: { extensions: ['.ts', '.js', '.tsx', '.jsx'] },
          module: {
            rules: [
              { test: /\.ts(x?)$/, exclude: /node_modules/, use: [{ loader: 'ts-loader', options: { transpileOnly: true } }] }
            ]
          }
        }
      }));
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
});