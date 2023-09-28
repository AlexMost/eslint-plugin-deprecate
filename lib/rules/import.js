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
                const importedModules = node.specifiers.length
                    ? node.specifiers
                        .filter((childNode) => !!childNode.imported)
                        .map((childNode) => childNode.imported.name)
                    : [];
                const importedModulesSet = new Set(importedModules);
                imports
                    .filter((imp) => imp.check(importPath, importedModulesSet))
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
            },
            MemberExpression(node) {
                if (!node.object.callee) {
                    return;
                }
                if ((node.object.callee.name !== 'require' || !node.object.arguments.length) && !node.property) {
                    return;
                }
                const requireArg = node.object.arguments[0];
                if (!requireArg || requireArg.type !== 'Literal') {
                    return;
                }
                const propertyNameSet = new Set([node.property.name]);
                imports
                    .filter((imp) => imp.check(requireArg.value, propertyNameSet))
                    .forEach((imp) => {
                        context.report({ node, message: imp.getErrMessage() });
                    });
            },
            VariableDeclaration(node) {
                if (!(node.declarations && node.declarations.length)) return;

                const childNode = node.declarations[0];
                if (!(childNode.id && childNode.id.type === 'ObjectPattern' && childNode.init)) return;

                const requireArg = childNode.init.arguments && childNode.init.arguments[0];
                if (!requireArg || requireArg.type !== 'Literal' || childNode.init.callee.name !== 'require') {
                    return;
                }

                const namedImports = childNode.id.properties
                  .filter((module) => !!module.value.name)
                  .map((module) => module.value.name);

                const namedImportsSet = new Set(namedImports);
                imports
                    .filter((imp) => imp.check(requireArg.value, namedImportsSet))
                    .forEach((imp) => {
                        context.report({ node, message: imp.getErrMessage() });
                    });
            },
        };
    }
};
