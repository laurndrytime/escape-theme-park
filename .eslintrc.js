// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["apps/**", "packages/**"],
  extends: ["@escape-theme-park/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {},
};
