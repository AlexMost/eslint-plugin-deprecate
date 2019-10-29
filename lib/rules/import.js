const ImportChecker = require('../ImportChecker');

module.exports = {
    meta: {
        docs: {
            description: 'Forbids importing from given files.'
        },
    },
    create(context) {
        const imports = context.options.map((opt) => new ImportChecker(opt));
        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;

                imports
                    .filter((imp) => imp.check(importPath))
                    .forEach((imp) => {
                        context.report({ node, message: imp.getErrMessage() });
                    });
            },
            CallExpression(node) {
                if (node.callee.name !== 'require' || !node.arguments.length) {
                    return;
                }
                const requireArg = node.arguments[0];
                if (requireArg.type !== 'Literal') {
                    return;
                }
                imports
                    .filter((imp) => imp.check(requireArg.value))
                    .forEach((imp) => {
                        context.report({ node, message: imp.getErrMessage() });
                    });
            }
        };
    }
};
