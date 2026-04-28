module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
