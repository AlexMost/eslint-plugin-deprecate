const rules = {
    'function-warning': require('./rules/function'),
    'function-error': require('./rules/function'),
    'import-warning': require('./rules/import'),
    'import-error': require('./rules/import'),
    'member-expression-warning': require('./rules/member-expression'),
    'member-expression-error': require('./rules/member-expression'),
};

module.exports = { rules };
