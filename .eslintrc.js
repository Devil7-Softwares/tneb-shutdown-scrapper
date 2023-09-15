module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true
  },
  extends: ['standard-with-typescript'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended']
    }
  ],
  plugins: [],
  rules: {
    '@typescript-eslint/semi': 'off'
  }
};
