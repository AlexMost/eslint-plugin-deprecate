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
        schema: {
            type: 'array',
            items: {
                oneOf: [
                    { type: 'string' },
                    {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            use: { type: 'string' }
                        },
                        required: ['name'],
                        additionalProperties: false
                    }
                ]
            }
        },
    },
    create(context) {
        const funcs = {};
        const options = context.options || [];
        options.map(makeFuncObj).forEach((fnObj) => {
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

