'use strict';

const path = require('path');

module.exports = {
  meta: {
    fixable: 'code',
  },
  create(context) {
    return {
      CallExpression(node) {
        const fileName = path.parse(context.getFilename()).name;
        if (
          node.callee.object
          && node.callee.object.type === 'Identifier'
          && node.callee.object.name === 'console'
          && node.callee.property.type === 'Identifier'
          && ['trace', 'debug', 'log', 'info'].includes(node.callee.property.name)
          && (!node.arguments.length || !context.getSource(node.arguments[0]).includes(` ${fileName} `))
        ) {
          context.report({
            node,
            message: 'Restricted lintfix/console.',
            fix: (fixer) => {
              const argsText = node.arguments.map((arg) => context.getSource(arg)).join(', ');
              if (node.arguments.length === 0) {
                return fixer.replaceText(
                  node,
                  `// console.debug('${node.callee.property.name.toUpperCase()}: ${fileName}')`
                );
              }
              return fixer.replaceText(
                node,
                `console.debug('${node.callee.property.name.toUpperCase()}: ${fileName} -', ${argsText})`
              );
            }
          });
        }
      }
    };
  }
};
