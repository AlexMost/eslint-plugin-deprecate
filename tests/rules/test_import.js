const rule = require( '../../lib/rules/import' );
const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('import', rule, {
    valid: [
        {
            code: 'import a from "Module"',
            parser: "babel-eslint",
            options: [ 'Legacy' ],
        }
    ],
    invalid: [
        {
            code: 'import a from "Legacy"',
            parser: "babel-eslint",
            options: [ 'Legacy' ],
            errors: [ {
                message: 'Module Legacy is deprecated.'
            } ]
        },
        {
            code: 'import a from "Legacy"',
            parser: "babel-eslint",
            options: [ {name: 'Legacy', use: 'New' }],
            errors: [ {
                message: 'Module Legacy is deprecated. Use New instead'
            } ]
        }
    ]
} );
