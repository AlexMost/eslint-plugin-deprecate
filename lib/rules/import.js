const makeImportObj = (importName) => {
    if (typeof importName === 'string') {
        return { name: importName };
    }
    if (typeof importName === 'object' && importName.name && importName.use) {
        return importName;
    }
    throw new Error(`Unsupported type of argument ${JSON.stringify(importName)}`);
};

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

const buildErrorMessage = (imp) => {
    let errorMsg = `Module ${imp.name} is deprecated.`;
    if (imp.use) {
        errorMsg += ` Use ${imp.use} instead.`;
    }
    return errorMsg;
};

module.exports = {
    meta: {
        docs: {
            description: 'Forbids importing from given files.'
        },
    },
    create(context) {
        const imports = {};
        context.options.map(makeImportObj).forEach((importObj) => {
            imports[importObj.name] = importObj;
        });

        return {
            ImportDeclaration(node) {
                const filename = context.eslint ? context.eslint.getFilename() : context.getFilename();
                const importPath = conditionallyFormatFilePath(filename, node.source.value);

                if (!Object.entries(imports)) return;

                const imp = Object.entries(imports)
                    .filter(([importString]) => importPath.includes(importString))
                    .map(([, value]) => value)
                    .shift();

                if (!imp) {
                    return;
                }

                context.report({ node, message: buildErrorMessage(imp) });
            },
            CallExpression(node) {
                if (node.callee.name !== 'require' || !node.arguments.length) {
                    return;
                }
                const requireArg = node.arguments[0];
                if (requireArg.type !== 'Literal') {
                    return;
                }
                const imp = imports[requireArg.value];

                if (!imp) {
                    return;
                }
                context.report({ node, message: buildErrorMessage(imp) });
            }
        };
    }
};
