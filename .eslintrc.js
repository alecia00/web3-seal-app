module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    'no-undef': 'warn', // Diubah dari 'error' ke 'warn'
    'import/no-unresolved': 'off' // Menambahkan aturan ini
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        'no-undef': 'warn' // Diubah dari 'error' ke 'warn'
      }
    }
  ]
};
