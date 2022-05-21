const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions: apiCompilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>'],
  modulePaths: [apiCompilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(apiCompilerOptions.paths)
};