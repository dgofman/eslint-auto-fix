'use strict';

const FUNCTION = Object.assign('FUNCTION');
const ruleComposer = require('eslint-rule-composer');
const lint = require('@typescript-eslint/eslint-plugin')
const rule = lint.rules['explicit-module-boundary-types'];
rule.meta.fixable = 'code';
rule.meta.schema[0].properties.includeAny = {
    type: "boolean",
}

const getType = (type, value) => {
    switch (type) {
        case 'Literal':
            return value === null ? 'any' : typeof (value);
        case 'BlockStatement':
        case 'ObjectExpression':
            return 'any'; // object
        case 'ArrayExpression':
            if (value === undefined) {
                return 'Array<any>';
            }
            let type = '[]';
            if (value.length) {
                const types = new Set(value.map(v => v && getType(v.type, v.value)));
                type = 'Array<' + (types.has('any') ? 'any' : [...types].join('|')) + '>';
            }
            return type;
        default:
            return 'any';
    }
}

const formatType = (node, type) => {
    return node.async ? `Promise<${type}>` : type;
}

const getInfo = (node, body) => {
    let info;
    switch (body.type) {
        case 'Property':
            const value = getInfo(body, body.value)[0];
            return [[body.key.name, value], body, getType(body.value.type, value)];
        case 'Literal':
            return [body.value, body, getType(body.type, body.value)];
        case 'ArrayExpression':
            return [body.elements.map(e => (e && e.type) === 'ArrayExpression' ? getInfo(e.parent, e)[0] : e.value), body, getType(body.type, body.elements)];
        case 'BlockStatement':
            return [body.body.map(b => getInfo(b, b)[0]), body, 'any']; // object
        case 'Identifier':
            return [body.name, body, 'any'];
        case 'ObjectExpression':
            return [body.properties.map(p => getInfo(p, p)[0]), body, 'any']; //object
        case 'CallExpression':
            info = getInfo(body, body.callee);
            return [info[0], body, info[2]];
        case 'MemberExpression':
            info = getInfo(body, body.object);
            return [info[0], body, info[2]];
        case 'EmptyStatement':
            return ['', body, 'any'];
        case 'LabeledStatement':
            return [[body.label.name, getInfo(body, body.body)[0]], body, 'any']; // object
        case 'ExpressionStatement':
            return [getInfo(body, body.expression)[0], body, getType(body.expression.type, body.expression.value)];
        case 'SpreadElement':
            return [getInfo(body, body.argument)[0], body, 'any']; //object
        case 'ArrowFunctionExpression':
            if (body !== node) {
                return traverseNode(body);
            } else {
                return traverseNode(body.body);
            }
        default:
            return [body.type, body, 'any'];
    }
}

const traverseNode = (node) => {
    if (node.parent && node.parent.type === 'ArrowFunctionExpression' && node.parent.body) {
        return getInfo(node, node.parent.body);
    } else if (node.type === 'ArrowFunctionExpression') {
        return getInfo(node, node.body);
    }
    return [FUNCTION, node, 'Function'];
}

module.exports = ruleComposer.filterReports(
    rule,
    (problem, context) => {
        const config = context.options[0] || {};
        const { node } = problem;
        const { sourceCode } = context;
        let returnType;
        let funcRef = node;
        if (node.body && node.body.type === 'BlockStatement' &&
            node.body.body && node.body.body.length &&
            node.body.body[0].type === 'ReturnStatement') {
            const body = node.body.body[0];
            const argument = body.argument;
            const [value, _b, type] = getInfo(body, argument);
            if (value === FUNCTION || (type === 'any' && !config.includeAny)) {
                return false;
            }
            returnType = formatType(node, type);
            // console.log(_b.loc, '\n', JSON.stringify(value), ': ', returnType);
        } else {
            const [value, b, type] = traverseNode(node);
            if (value === FUNCTION || (type === 'any' && !config.includeAny)) {
                return false;
            }
            funcRef = b.parent;
            returnType = formatType(b.parent, type);
            // console.log(b.loc, '\n', JSON.stringify(value), ': ', formatType(b.parent, type));
        }

        let token = sourceCode.getTokenBefore(funcRef.body);
        if (token.type === 'Punctuator' && token.value === '=>') {
            token = sourceCode.getTokenBefore(token);
        }

        if (token.type !== 'Punctuator' || token.value !== ')') {
            return false;
        }

        problem.fix = fixer => {
            return fixer.insertTextAfter(token, `: ${returnType}`);
        };
        return problem;
    }
);
