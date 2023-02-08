/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.svg$": "<rootDir>/svg-transform.js",
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  // 每个测试前加入的文件，注意顺序
  setupFilesAfterEnv: ["<rootDir>/prolify.mock.js", '<rootDir>/setup-jest.js'],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(react))"]
};
