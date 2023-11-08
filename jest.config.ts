const config =  {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      babel: true,
      tsconfig: "./tsconfig.jest.json"
    }],
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  coveragePathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/storyboard_static/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/app/\\(pages\\)/\\(examples\\)",
    "<rootDir>/src/stories",
    // "<rootDir>/src/app/authentication"
  ],
  modulePathIgnorePatterns: ['node_modules', 'jest-test-results.json'],
};

export default config;