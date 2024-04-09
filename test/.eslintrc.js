module.exports = {
    plugins: ['@typescript-eslint', 'lintfix'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/recommended'
    ],
    rules: {
        'lintfix/eqeqeq': 'error',
        'lintfix/ts-ignore': 'error',
        'lintfix/no-unescaped': 'error',
        'react/no-unescaped-entities': 'warn', // `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  -> lintfix/no-unescaped
        'lintfix/boundary-types': ['error', { includeAny: true }],
        '@typescript-eslint/explicit-module-boundary-types': 'warn', // Argument '...' should be typed with a non-any type -> lintfix/boundary-types
        'lintfix/implicit-any': 'error',
        '@typescript-eslint/no-explicit-any': 'warn', // Unexpected any. Specify a different type -> lintfix/implicit-any
        'lintfix/no-unused-imports': 'error',
        'import/named': 'warn', // ... not found in '...' -> lintfix/no-unused-imports
        'lintfix/no-unused-vars': 'error',
        '@typescript-eslint/no-unused-vars': 'warn', // is defined but never used -> lintfix/no-unused-vars
        'lintfix/console': 'error',
        'no-console': ['error', { allow: ['error', 'warn', 'debug'] }], // Unexpected console statement -> lintfix/console
        'lintfix/maxlen': ['error', { code: 180 }],
        'max-len': 'off', // This line has a length of xxx. Maximum allowed is 80 -> lintfix/maxlen
        'lintfix/prefer-const': 'error',
        'prefer-const': 'off', // '...' is never reassigned. Use 'const' instead -> lintfix/prefer-const'
        'lintfix/jsx-a11y': 'error',
        'jsx-a11y/click-events-have-key-events': 'warn', // Visible, non-interactive elements with click handlers must have at least one keyboard listener -> lintfix/jsx-a11y
        'jsx-a11y/label-has-associated-control': 'warn', // A form label must be associated with a control -> lintfix/jsx-a11y
        'lintfix/react': 'error',
        'react/display-name': 'error', // Component definition is missing display name -> lintfix/react
        'lintfix/no-duplicate-props': 'error',
        'react/jsx-no-duplicate-props': 'warn', // No duplicate props allowed  -> lintfix/no-duplicate-props
    },
    settings: {
        'react': {
            version: '18'
        }
    }
}