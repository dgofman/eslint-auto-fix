'use strict';

module.exports = {
    meta: {
        fixable: 'code',
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        return {
            BinaryExpression(node) {
                if (node.operator === '==' || node.operator === '!=') {
                    const token = sourceCode.getFirstTokenBetween(
                        node.left,
                        node.right,
                        token => token.value === node.operator
                    );
                    context.report({
                        node,
                        message: `Use strict equality ('${node.operator}=') instead of loose equality ('${node.operator}').`,
                        fix(fixer) {
                            return fixer.replaceText(token, node.operator + '=');
                        }
                    });
                }
            }
        };
    }
}