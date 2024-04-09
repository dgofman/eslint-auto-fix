# lintfix

## Install & usage

```bash
npm i eslint-plugin-lintfix -D
```

add prefix "lintfix" to the rulename in eslintrc:
```js
{
  "plugins": ["lintfix"],
  "rules": {
    "lintfix/jsx-a11y": ["error", { label: "my-label" }],
    "lintfix/boundary-types": ["error", { includeAny: false }],
    "lintfix/maxlen": ["error", { code: 180 }],
    "lintfix/console": "error",
    "no-console": ["error", { allow: ["error", "warn", "debug"]}] // allow error and warn 
  }
}
```

```bash
npx eslint . --fix
```

## Supported rules

Name | Description
----- | -----
[lintfix/eqeqeq](https://eslint.org/docs/rules/eqeqeq) | require the use of `===` and `!==`
[lintfix/ts-ignore](https://typescript-eslint.io/rules/ban-ts-comment/) | Disallow @ts-<directive> comments or require descriptions after directives.
[lintfix/no-unescaped](https://eslint.org/docs/latest/rules/no-useless-escape) | Disallow unnecessary escape characters.
[lintfix/boundary-types](https://typescript-eslint.io/rules/explicit-module-boundary-types/) | Require explicit return and argument types on exported functions' and classes' public class methods.
[lintfix/implicit-any](https://typescript-eslint.io/rules/no-explicit-any/) | The any type in TypeScript is a dangerous "escape hatch" from the type system.
[lintfix/no-unused-imports](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/named.md) | Verifies that all named imports are part of the set of named exports in the referenced module.
[lintfix/no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars) | Disallow unused variables.
[lintfix/console](https://eslint.org/docs/latest/rules/no-console) | Disallow the use of some console functions.
[lintfix/maxlen](https://eslint.org/docs/latest/rules/max-len) | Enforce a maximum line length.
[lintfix/prefer-const](https://eslint.org/docs/latest/rules/prefer-const) | Require const declarations for variables that are never reassigned after declared.
[lintfix/jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/click-events-have-key-events.md) | Enforce onClick is accompanied by at least one of the following: onKeyUp, onKeyDown, onKeyPress.
[lintfix/jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md) | Enforce that a label tag has a text label and an associated control.
[lintfix/react](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md) | DisplayName allows you to name your component. This name is used by React in debugging messages.
[lintfix/no-duplicate-props](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md) | Creating JSX elements with duplicate props can cause unexpected behavior in your application.

## Recommend Settings
```js
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
    'lintfix/boundary-types': ['error', { includeAny: false }],
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
```
