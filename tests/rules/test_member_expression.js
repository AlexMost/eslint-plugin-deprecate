const rule = require( '../../lib/rules/member-expression' );
const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('function', rule, {
    valid: [
        'var a = withoutArguments();',
        {
            code: 'React.Component',
            options: ['React.createClass'],
        },
        {
            code: 'fun(React)',
            options: [{ name: 'React.createClass', use: 'another' }],
        }
    ],
    invalid: [
        {
            code: 'React.createClass',
            options: [ 'React.createClass' ],
            errors: [ {
                message: 'Member expression React.createClass is deprecated.'
            } ]
        },
        {
            code: 'React.createClass',
            options: [ { name: 'React.createClass', use: 'native es6 classes or react-create-class package' }],
            errors: [ {
                message: 'Member expression React.createClass is deprecated. ' +
                'Use native es6 classes or react-create-class package instead'
            } ]
        },
    ]
} );
