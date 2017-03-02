function makeImportObj(importName) {

    if (typeof importName === 'string') {
        return { name: importName };
    }
    if (typeof importName === 'object' && importName.name && importName.use) {
        return importName;
    }
    throw new Error('Unsupported type of argument ' + JSON.stringify(importName));
}

module.exports = {
    meta: {
        docs: {
            description: 'forbid some func names'
        },
    },
    create: function( context ) {
        const imports = {};
        context.options.map(makeImportObj).forEach((importObj) => {
            imports[importObj.name] = importObj;
        });

        return {
            ImportDeclaration: function( node ) {
                const imp = imports[node.source.value];
                if (!imp) {
                    return;
                }
                let errorMsg = `Module ${ imp.name } is deprecated.`;
                if (imp.use) {
                    errorMsg += ` Use ${ imp.use } instead`;
                }
                context.report( { node: node, message: errorMsg } );
            }
        };
    }
};

