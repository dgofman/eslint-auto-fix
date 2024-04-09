'use strict';

function getUnusedImports(scope, unusedImports) {
    const variables = scope.variables;
    const childScopes = scope.childScopes;
    if (scope.type !== 'global') {
        variables.forEach(variable => {
            if (variable.defs.length) {
                const def = variable.defs[0];
                const node = def.node;
                switch (node.type) {
                    case 'ImportSpecifier':
                    case 'ImportDefaultSpecifier':
                    case 'ImportNamespaceSpecifier':
                        const isUsed = variable.references.some(ref => ref.isRead());
                        if (!isUsed) {
                            unusedImports.push(variable);
                        }
                }
            }
        });
    }
    childScopes.forEach(childScope => {
        getUnusedImports(childScope, unusedImports);
    });
    return unusedImports;
}

module.exports = {
    meta: {
        fixable: 'code',
    },
    create(context) {
        return {
            'Program:exit'() {
                const unusedImports = getUnusedImports(context.getScope(), []);
                const commaFilter = { filter: (token) => token.value === ',' };
                const includeCommentsFilter = { includeComments: false };

                if (unusedImports.length) {
                    unusedImports.forEach(v => {
                        const node = v.identifiers[0];
                        context.report({
                            node,
                            message: `'${node.name}' not found.`, //... not found in '...' - import/named
                            fix: (fixer) => {
                                const parent = node.parent;
                                const grandParent = parent.parent;
                                if (!grandParent) {
                                    return null;
                                }
                                if (grandParent.specifiers.length === 1) {
                                    const nextToken = context.getTokenAfter(grandParent, includeCommentsFilter);
                                    const newLinesBetween = nextToken
                                        ? nextToken.loc.start.line - grandParent.loc.start.line
                                        : 0;
                                    const endOfReplaceRange = nextToken ? nextToken.range[0] : grandParent.range[1];
                                    const count = Math.max(0, newLinesBetween - 1);

                                    return [
                                        fixer.remove(grandParent),
                                        fixer.replaceTextRange(
                                            [grandParent.range[1], endOfReplaceRange],
                                            '\n'.repeat(count),
                                        ),
                                    ];
                                }

                                // Not last specifier
                                if (parent !== grandParent.specifiers[grandParent.specifiers.length - 1]) {
                                    const comma = context.getTokenAfter(parent, commaFilter);
                                    const prevNode = context.getTokenBefore(parent);

                                    return [
                                        fixer.removeRange([prevNode.range[1], parent.range[0]]),
                                        fixer.remove(parent),
                                        fixer.remove(comma),
                                    ];
                                }

                                // Default export and a single normal left, ex. 'import default, { package1 } from 'module';'
                                if (
                                    grandParent.specifiers.filter((specifier) => specifier.type === 'ImportSpecifier')
                                        .length === 1
                                ) {
                                    const start = context.getTokenBefore(parent, commaFilter);
                                    const end = context.getTokenAfter(parent, {
                                        filter: (token) => token.value === '}',
                                    });

                                    return fixer.removeRange([start.range[0], end.range[1]]);
                                }

                                return fixer.removeRange([
                                    context.getTokenBefore(parent, commaFilter).range[0],
                                    parent.range[1],
                                ]);
                            }
                        });
                    });
                }
            }
        };
    }
};
