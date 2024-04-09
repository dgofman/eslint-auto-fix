'use strict';

const ruleComposer = require('eslint-rule-composer');
const lint = require('eslint-plugin-react');
const rule = lint.rules['jsx-no-duplicate-props'];
rule.meta.fixable = 'code';

module.exports = ruleComposer.mapReports(
    rule,
    (problem) => {
        problem.fix = fixer => {
            return fixer.remove(problem.node)
        };
        return problem;
    }
);
