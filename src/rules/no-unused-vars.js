'use strict';

function unusedVariables(scope, unusedVars) {
    const variables = scope.variables;
    const childScopes = scope.childScopes;
    if (scope.type !== 'global') {
        variables.forEach(variable => {
            if (variable.defs.length) {
                const def = variable.defs[0];
                const type = def.type;
                let node = def.node;
                if (node.type === 'VariableDeclarator') {
                    node = node.parent;
                }
                const isExport = node.parent.type.includes('Export');
                if (!isExport && (type === 'Parameter' || type === 'Variable')) {
                    const isUsed = variable.references.some(ref => ref.isRead());
                    if (!variable.name.startsWith('_') && !isUsed) {
                        unusedVars.push(variable);
                    }
                }
            }
        });
    }
    childScopes.forEach(childScope => {
        unusedVariables(childScope, unusedVars);
    });
    return unusedVars;
}

module.exports = {
    meta: {
        fixable: 'code',
    },
    create(context) {
        return {
            'Program:exit'() {
                const unusedVars = unusedVariables(context.getScope(), []);
                if (unusedVars.length) {
                    unusedVars.forEach(v => {
                        const node = v.identifiers[0];
                        context.report({
                            node,
                            message: `'${node.name}' is defined but never used.`,
                            fix: (fixer) => {
                                return fixer.insertTextBefore(node, '_');
                            }
                        });
                    });
                }
            }
        };
    }
};
