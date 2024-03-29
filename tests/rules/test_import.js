const rule = require('../../lib/rules/import');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('import', rule, {
    valid: [
        'require()',
        'require(fn())',
        {
            code: 'import a from "Module"',
            parser: 'babel-eslint',
            options: ['Legacy'],
        },
        {
            code: 'const a = require("Module")',
            parser: 'babel-eslint',
            options: ['Legacy'],
        },
        {
            code: 'const a = require("Module")',
            parser: 'babel-eslint',
            options: ['path/to/Legacy'],
        },
        {
            code: `import { UserStatusIcon } from './icon'`,
            parser: 'babel-eslint',
            options: [{ name: 'gettext', use: 'ttag' }],
        },
        {
            code: `import { navigate } from 'utils/navigate'`,
            parser: 'babel-eslint',
            options: [{ module: 'gatsby', name: 'navigate', use: 'utils/navigate' }],
        },
        {
            code: 'const redirect = require("gatsby").redirect',
            parser: 'babel-eslint',
            options: [{ module: 'gatsby', name: 'navigate', use: 'utils/navigate' }],
        },
        {
            code: 'const { redirect } = require("gatsby")',
            parser: 'babel-eslint',
            options: [{ module: 'gatsby', name: 'navigate', use: 'utils/navigate' }],
        },
    ],
    invalid: [
        {
            code: 'import a from "Legacy"',
            parser: 'babel-eslint',
            options: ['Legacy'],
            errors: [{
                message: 'Module Legacy is deprecated.'
            }]
        },
        {
            code: 'import a from "test.sss"',
            parser: 'babel-eslint',
            options: [{ nameRegExp: '.sss$', use: '.css imports' }],
            errors: [{
                message: 'Import pattern \'.sss$\' is deprecated. Use .css imports instead.'
            }]
        },
        {
            code: 'import a from "Legacy"',
            parser: 'babel-eslint',
            options: [{ name: 'Legacy', use: 'New' }],
            errors: [{
                message: 'Module Legacy is deprecated. Use New instead.'
            }]
        },
        {
            code: 'import a from "path/to/Legacy"',
            parser: 'babel-eslint',
            options: [{ nameRegExp: '\\/Legacy', use: 'New' }],
            errors: [{
                message: 'Import pattern \'\\/Legacy\' is deprecated. Use New instead.'
            }]
        },
        {
            code: 'import a from "../../Legacy"',
            parser: 'babel-eslint',
            options: [{ nameRegExp: '\\/Legacy', use: 'New' }],
            errors: [{
                message: 'Import pattern \'\\/Legacy\' is deprecated. Use New instead.'
            }]
        },
        {
            code: 'var a = require("Legacy")',
            options: ['Legacy'],
            errors: [{
                message: 'Module Legacy is deprecated.'
            }]
        },
        {
            code: 'var a = require("Legacy")',
            options: [{ name: 'Legacy', use: 'New' }],
            errors: [{
                message: 'Module Legacy is deprecated. Use New instead.'
            }]
        },
        {
            code: 'import { navigate, gatsbyImage } from "gatsby"',
            parser: 'babel-eslint',
            options: [{ module: 'gatsby', name: 'navigate', use: 'utils/navigate' }],
            errors: [{
                message: `navigate from gatsby is deprecated. Use utils/navigate instead.`
            }]
        },
        {
            code: 'const navigate = require("gatsby").navigate',
            parser: 'babel-eslint',
            options: [{ module: 'gatsby', name: 'navigate', use: 'utils/navigate' }],
            errors: [{
                message: `navigate from gatsby is deprecated. Use utils/navigate instead.`
            }]
        },
        {
            code: 'const { navigate, gatsbyImage } = require("gatsby")',
            parser: 'babel-eslint',
            options: [{ module: 'gatsby', name: 'navigate', use: 'utils/navigate' }],
            errors: [{
                message: `navigate from gatsby is deprecated. Use utils/navigate instead.`
            }]
        },
    ]
});
