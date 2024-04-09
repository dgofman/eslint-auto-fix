'use strict';

const ruleComposer = require('eslint-rule-composer');
const lint = require('eslint-plugin-react');
const rule = lint.rules['no-unescaped-entities'];
rule.meta.fixable = 'code';

module.exports = ruleComposer.mapReports(
    rule,
    (problem, context) => {
        let replacements = {
            '"': '&quot;',
            '\'': '&apos;'
        };
        const config = context.options[0] || {};
        if (config.replacements) {
            replacements = config.replacements;
        }

        problem.fix = fixer => {
            const node = problem.node;
            let text = node.raw;
            for (const [key, value] of Object.entries(replacements)) {
                text = text.replace(new RegExp(key, 'g'), value);
            }
            return fixer.replaceText(node, text);
        };
        return problem;
    }
);
