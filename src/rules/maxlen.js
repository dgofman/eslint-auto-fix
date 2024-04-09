'use strict';

const ruleComposer = require('eslint-rule-composer');
const eslint = require('eslint');
const linter = new eslint.Linter();
const rule = linter.getRules().get('max-len');
rule.meta.fixable = 'code';

module.exports = ruleComposer.mapReports(
  rule,
  (problem, context) => {
    const config = context.options[0] || {};
    const maxWidth = config.code || 200;

    let lastLine;
    problem.fix = fixer => {
      const { node } = problem;
      const { sourceCode } = context;
      const fixes = [];

      node.comments.forEach(t => {
        if (t.loc.end.column >= maxWidth) {
          const line = sourceCode.lines[t.loc.start.line - 1];
          const index = line.lastIndexOf(' ', maxWidth - 3); '// '
          const group = line.match(/^\s*(\/\/|\/\*)/);
          if (index !== -1 && group && group.length > 1) {
            const beginIndex = t.loc.start.column;
            const delim = group[1] === '//' ? '// ' : '   ';
            const pads = ' '.repeat(beginIndex);
            fixes.push(fixer.replaceText(t,
              line.substring(beginIndex, index) +
              '\n' + pads + delim +
              line.substring(index)));
          }
        }
      });

      node.tokens.forEach(t => {
        const { line, column } = t.loc.start;
        if (lastLine !== line && t.loc.end.column >= maxWidth) {
          if (column !== 0) {
            lastLine = line;
            fixes.push(fixer.insertTextBeforeRange(t.range, '\n'));
          }
        }
      });
      return fixes;
    };
    return problem;
  }
);
