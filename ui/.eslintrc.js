module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    "jest"
  ],
  rules: {
    "indent": ["error", 4],
    "semi": ["error", "always"],
    "react/no-unescaped-entities": 0,
  }
}
