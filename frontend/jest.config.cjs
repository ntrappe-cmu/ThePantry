// Jest configuration for ES modules
process.env.NODE_OPTIONS = '--experimental-vm-modules';

module.exports = {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/jest/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.jsx',
  ],
};