'use strict';

function getVariables(scope, vars) {
  const variables = scope.variables;
  const childScopes = scope.childScopes;
  if (scope.type !== 'global') {
    variables.forEach(variable => {
      if (variable.defs.length) {
        const def = variable.defs[0];
        const type = def.type;
        const parentType = def.name.parent.type;
        if (type === 'Parameter' &&
          !def.name.typeAnnotation &&
          variable.name !== '_' &&
          (!variable.references.length || parentType === 'FunctionDeclaration')) {
          switch (parentType) {
            case 'FunctionDeclaration':
            case 'FunctionExpression':
            case 'ArrowFunctionExpression':
              vars.push(variable);
          }
        }
      }
    });
  }
  childScopes.forEach(childScope => {
    getVariables(childScope, vars);
  });
  return vars;
}

module.exports = {
  meta: {
    fixable: 'code',
  },
  create(context) {
    return {
      'Program:exit'() {
        const vars = getVariables(context.getScope(), []);
        if (vars.length) {
          vars.forEach(v => {
            const node = v.identifiers[0];
            context.report({
              node,
              message: `'${node.name}' is defined but never used.`,
              fix: (fixer) => {
                return fixer.insertTextAfter(node, ': any');
              }
            });
          });
        }
      }
    };
  }
};