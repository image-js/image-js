module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '/lib-test/',
    '/lib-esm/'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '/lib-test/',
    '/lib-esm/'
  ],
  moduleNameMapper: {
    '^ijs$': '<rootDir>/packages/image-js/src/index.ts',
    '^test$': '<rootDir>/test/index.ts'
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json'
    }
  }
};
