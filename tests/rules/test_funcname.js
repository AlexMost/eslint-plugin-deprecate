const rule = require('../../lib/rules/function');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('function', rule, {
    valid: [
        'var a = withoutArguments();',
        {
            code: 'var a = withoutArguments();',
            options: ['f'],
        },
        {
            code: 'var a = withoutArguments();',
            options: [{ name: 'f', use: 'f2' }],
        }
    ],
    invalid: [
        {
            code: 'var a = f1();',
            options: ['f1'],
            errors: [{
                message: 'Function f1 is deprecated.'
            }]
        },
        {
            code: 'var a = f1(); f2();',
            options: ['f1', 'f2'],
            errors: [
                { message: 'Function f1 is deprecated.' },
                { message: 'Function f2 is deprecated.' }
            ]
        },
        {
            code: 'var a = f1(); f2();',
            options: [{ name: 'f1', use: 'f2' }],
            errors: [
                { message: 'Function f1 is deprecated. Use f2 instead' },
            ]
        }
    ]
});
