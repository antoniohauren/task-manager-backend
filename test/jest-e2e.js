/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./jest-base.js');

module.exports = {
  ...baseConfig,
  testRegex: '.e2e-spec.ts$',
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
};
