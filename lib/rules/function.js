function makeFuncObj(funcName) {
    if (typeof funcName === 'string') {
        return { name: funcName };
    }
    if (typeof funcName === 'object' && funcName.name && funcName.use) {
        return funcName;
    }
    throw new Error(`Unsupported type of argument ${JSON.stringify(funcName)}`);
}

module.exports = {
    meta: {
        docs: {
            description: 'forbid some func names'
        },
    },
    create(context) {
        const funcs = {};
        context.options.map(makeFuncObj).forEach((fnObj) => {
            funcs[fnObj.name] = fnObj;
        });

        return {
            CallExpression(node) {
                const fn = funcs[node.callee.name];
                if (!fn) {
                    return;
                }
                let errorMsg = `Function ${fn.name} is deprecated.`;
                if (fn.use) {
                    errorMsg += ` Use ${fn.use} instead`;
                }
                context.report({ node, message: errorMsg });
            }
        };
    }
};

