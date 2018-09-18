module.exports = {
  'extends': 'standard',
  env: {
    'node': true,
    'es6': true
  },
  overrides: [{
    files: ['**/*.test.js', 'jest.setup.js'],
    env: {
      jest: true
    },
    plugins: ['jest'],
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error'
    }
  }]
}
