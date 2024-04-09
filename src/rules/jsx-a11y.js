'use strict';

const ruleComposer = require('eslint-rule-composer');
const lint = require('eslint-plugin-jsx-a11y');

const hasMissingAttribute = (node, name) => {
    if (node.type === 'JSXOpeningElement') {
        return !node.attributes.some(attribute => hasAttribute(attribute, name));
    }
    return true;
}

const hasAttribute = (attribute, name) => {
    return attribute.type === 'JSXAttribute' &&
        attribute.name.name === name;
}

const fixRule = (rule, name, value) => {
    rule.meta.fixable = 'code';
    return ruleComposer.mapReports(
        rule,
        (problem, context) => {
            if (name === 'htmlFor') {
                const config = context.options[0] || {};
                value = config.label || 'label';
            }

            problem.fix = fixer => {
                const { node } = problem;
                if (value === null) {
                    if (hasAttribute(node, name)) {
                        return [fixer.removeRange([node.range[0] - 1, node.range[1]])];
                    }
                } else if (hasMissingAttribute(node, name)) {
                    if (node.attributes && node.attributes.length) {
                        return [fixer.insertTextAfter(node.attributes[node.attributes.length - 1], ` ${name}="${value}"`)];
                    } else {
                        const index = node.range[1] - 1;
                        return [fixer.insertTextBeforeRange([index, index], ` ${name}="${value}"`)];
                    }
                }
                return [];
            };
            return problem;
        }
    );
}

const fixMouseKey = (rule) => {
    rule.meta.fixable = true;
    return ruleComposer.mapReports(
        rule,
        (problem) => {
            const attrs = [];
            problem.fix = fixer => {
                const { node } = problem;
                node.attributes.forEach(a => {
                    if (a.name.name === 'onMouseOver' && !node.attributes.find(a => a.name.name === 'onFocus')) {
                        attrs.push('onFocus={() => false}');
                    }
                    if (a.name.name === 'onMouseOut' && !node.attributes.find(a => a.name.name === 'onBlur')) {
                        attrs.push('onBlur={() => false}');
                    }
                });
                if (attrs.length) {
                    return [fixer.insertTextAfter(node.attributes[node.attributes.length - 1], ` ${attrs.join(' ')}`)];
                }
                return [];
            };
            return problem;
        }
    );
};

module.exports = ruleComposer.joinReports([
    // jsx-a11y/no-static-element-interactions - Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for 
    //                                                                                          tabbing, mouse, keyboard, and touch inputs to an interactive content element.
    fixRule(lint.rules['no-static-element-interactions'], 'aria-hidden', 'true'),
    // jsx-a11y/click-events-have-key-events - Visible, non-interactive elements with click handlers must have at least one keyboard listener.
    fixRule(lint.rules['click-events-have-key-events'], 'aria-hidden', 'true'),
    //  jsx-a11y/label-has-associated-control - A form label must be associated with a control
    fixRule(lint.rules['label-has-associated-control'], 'htmlFor'),
    // jsx-a11y/no-autofocus - The autoFocus prop should not be used, as it can reduce usability and accessibility for users
    fixRule(lint.rules['no-autofocus'], 'autoFocus', null),
    // jsx-a11y/tabindex-no-positive - Avoid positive integer values for tabIndex
    fixRule(lint.rules['tabindex-no-positive'], 'tabIndex', null),
    // jsx-a11y/mouse-events-have-key-events - onMouseOver must be accompanied by onFocus for accessibility.
    // jsx-a11y/mouse-events-have-key-events - onMouseOut must be accompanied by onBlur for accessibility.
    fixMouseKey(lint.rules['mouse-events-have-key-events'])
]);