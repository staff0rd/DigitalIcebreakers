const { pathsToModuleNameMapper } = require("ts-jest");
const requireJSON5 = require("require-json5");
const { compilerOptions } = requireJSON5("./tsconfig.paths.json");

module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@?firebase" +
      //   + "|some-other-package"
      ")/)",
  ],
  setupFiles: ["<rootDir>/jest-setup.js"],
};
