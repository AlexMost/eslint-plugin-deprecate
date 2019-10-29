const ImportChecker = require('../ImportChecker');

const convertRelativePathToAbsolute = (filePath, importArray) => {
    // remove moduleName
    let newPath = filePath.substr(filePath.lastIndexOf('/'));
    importArray.forEach((segment) => {
        if (segment === '..') {
            newPath = newPath.substr(0, newPath.lastIndexOf('/'));
        } else {
            newPath = newPath.concat(`/${segment}`);
        }
    });
    return newPath;
};

const conditionallyFormatFilePath = (currentFilename, currentImport) => {
    const pathSegments = currentImport.split('/');
    if (pathSegments.includes('..')) {
        // in relative path
        const proposedAbsolutePath = convertRelativePathToAbsolute(currentFilename, pathSegments);
        currentImport = proposedAbsolutePath;
    }

    const prefixesToDelete = ['/', './'];
    prefixesToDelete.forEach((prefix) => {
        currentImport = currentImport.startsWith(prefix) ?
            currentImport.substring(prefix.length, currentImport.length) :
            currentImport;
    });
    return currentImport;
};

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
                const filename = context.eslint ? context.eslint.getFilename() : context.getFilename();
                const importPath = conditionallyFormatFilePath(filename, node.source.value);

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
