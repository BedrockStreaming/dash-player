/* eslint no-inline-comments: "off" */
const path = require('path');

const rootDir = path.join(__dirname, '../../');

module.exports = {
  name: 'Player Dash',
  rootDir: `${rootDir}`,
  testURL: 'https://www.dash.fr',
  testEnvironment: 'jest-environment-jsdom-global',

  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  /*
   * Deactivation of auto-mocking for these modules.
   *
   * Note: module are matched again theirs absolute path
   * (ex: /home/nicolas/projects/site-6play-v4/node_modules/react)
   * EXCEPT for Node's core modules (path, fs, ...)
   *
   * This configuration is overridden by jest.mock / unMock
   */
  unmockedModulePathPatterns: [
    '^[a-z].*$', // Node core modules (path, fs, ...)
  ],

  /*
   * Jest reads ALL the files under rootDir on loading
   * and built a giant array containing all the JS files
   * (with node-haste).
   *
   * Only the module in the giant array can be jest.mock / dontMock.
   *
   * For performance reason, we need to ignore node_modules
   * except the modules who have to be mocked :
   * - Link
   * - moment
   * (maybe there will be more excepted modules in the future).
   */
  modulePathIgnorePatterns: [],

  moduleFileExtensions: ['js', 'json'],

  testRegex: '__tests__/.*\\.spec\\.(json|js)$',

  setupTestFrameworkScriptFile: '<rootDir>config/jest/setup.js',

  automock: true,

  timers: 'fake',
};
