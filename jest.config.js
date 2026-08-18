const nextJest = require("next/jest");

// Providing path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: [
    "**/modules/**/?(*.)+(spec|test).[jt]s?(x)",
    "**/shared/**/?(*.)+(spec|test).[jt]s?(x)",
    "**/app/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/tests/"],
  moduleNameMapper: {
    // Handle module aliases
    "^@/(.*)$": "<rootDir>/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
