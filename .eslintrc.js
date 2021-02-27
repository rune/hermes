console.log("Starting eslintrc.js")

module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    amd: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "prettier"],
  rules: {
    "valid-jsdoc": ["error"],
    "no-console": ["warn"],
    "no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
  },
}
