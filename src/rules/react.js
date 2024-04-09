'use strict';

const ruleComposer = require('eslint-rule-composer');
const lint = require('eslint-plugin-react');
const rule = lint.rules['display-name'];
rule.meta.fixable = 'code';

module.exports = ruleComposer.filterReports(
    rule,
    (problem) => {
        const node = problem.node.parent.id;
        if (!node || !node.name) {
            return false;
        }
        problem.fix = fixer => {
            const index = problem.node.range[1] + 1;
            return [fixer.insertTextAfterRange([index, index], `\n${node.name}.displayName = '${node.name}';`)];
        };
        return problem;
    }
);
