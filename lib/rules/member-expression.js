function makeMemberObj(memberName) {
    if (typeof memberName === 'string') {
        return { name: memberName };
    }
    if (typeof memberName === 'object' && memberName.name && memberName.use) {
        return memberName;
    }
    throw new Error(`Unsupported type of argument ${JSON.stringify(memberName)}`);
}

module.exports = {
    meta: {
        docs: {
            description: 'forbid some func names'
        },
    },
    create(context) {
        const memberStrMap = {};
        context.options.map(makeMemberObj).forEach((importObj) => {
            memberStrMap[importObj.name] = importObj;
        });
        return {
            MemberExpression(node) {
                const isObjectIndetifier = node.object && node.object.type === 'Identifier';
                if (!isObjectIndetifier) return;
                const isPropertyIdentifier = node.property && node.property.type === 'Identifier';
                if (!isPropertyIdentifier) return;
                const exprStr = `${node.object.name}.${node.property.name}`;

                const memberStr = memberStrMap[exprStr];
                if (!memberStr) {
                    return;
                }
                let errorMsg = `Member expression ${memberStr.name} is deprecated.`;
                if (memberStr.use) {
                    errorMsg += ` Use ${memberStr.use} instead`;
                }
                context.report({ node, message: errorMsg });
            }
        };
    }
};

