'use strict';

// https://textlint.github.io/docs/rule-fixable.html

const console = require('./rules/console');
const maxlen = require('./rules/maxlen');
const react = require('./rules/react');
const eqeqeq = require('./rules/eqeqeq');
const noUnescaped = require('./rules/no-unescaped.js');
const noUnusedVars = require('./rules/no-unused-vars');
const noUnusedImports = require('./rules/no-unused-imports');
const implicitAny = require('./rules/implicit-any');
const jsxA11y = require('./rules/jsx-a11y');
const preferConst = require('./rules/prefer-const');
const duplicateProps = require('./rules/no-duplicate-props');
const tsIgnore = require('./rules/ts-ignore');
const boundaryTypes = require('./rules/boundary-types');


global.console.log(`ESLint is automatically fixing code style issues.
This may take a moment, do not interrupt the process.`);

module.exports = {
  rules: {
    console,
    maxlen,
    react,
    eqeqeq,
    'jsx-a11y': jsxA11y,
    'no-unescaped': noUnescaped,
    'no-unused-vars': noUnusedVars,
    'no-unused-imports': noUnusedImports,
    'implicit-any': implicitAny,
    'prefer-const': preferConst,
    'no-duplicate-props': duplicateProps,
    'ts-ignore': tsIgnore,
    'boundary-types': boundaryTypes
  }
}