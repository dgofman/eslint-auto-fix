'use strict';

const ruleComposer = require('eslint-rule-composer');
const eslint = require('eslint');
const linter = new eslint.Linter();
const rule = linter.getRules().get('prefer-const');
rule.meta.fixable = 'code';

module.exports = ruleComposer.filterReports(
  rule,
  (problem, context) => {
    const { sourceCode } = context;
    const node = problem.node.parent.parent;
    const index = sourceCode.getIndexFromLoc(node.loc.start);
    if (node.kind !== 'let') {
      return false;
    }
    problem.fix = fixer => {
      return fixer.replaceTextRange([index, index + node.kind.length], 'const');
    };
    return problem;
  }
);
