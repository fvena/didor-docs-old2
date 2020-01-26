module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'array-element-newline': ['error', 'consistent'],
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
    'max-len': 0,
    'no-nested-ternary': 0,
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: false }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
