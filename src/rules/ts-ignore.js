'use strict';

const ruleComposer = require('eslint-rule-composer');
const lint = require('@typescript-eslint/eslint-plugin')
const rule = lint.rules['ban-ts-comment'];
rule.meta.fixable = 'code';

const nextLine = '/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */';
const tsIgnore = '/* @ts-ignore */';

module.exports = ruleComposer.filterReports(
    rule,
    (problem, context) => {
        const { lines } = context.sourceCode;
        const { node } = problem;
        const line = node.loc.start.line - 1;
        if (line > 1 && lines[line - 1].includes(nextLine)) {
            return false;
        }
        problem.fix = fixer => {
            const text = nextLine + '\n' + tsIgnore.padStart(node.loc.start.column + tsIgnore.length, ' ');
            return fixer.replaceText(node, text);
        };
        return problem;
    }
);
