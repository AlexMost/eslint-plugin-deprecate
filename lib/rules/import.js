const makeImportObj = (importName) => {
    if (typeof importName === 'string') {
        return { name: importName }
    }
    if (typeof importName === 'object' && importName.name && importName.use) {
        return importName
    }
    throw new Error(`Unsupported type of argument ${JSON.stringify(importName)}`)
}

const applyRelativeImportToCurrentFilepath = (filePath, importArray) => {
    // remove moduleName
    let newPath = filePath.substr(filePath.lastIndexOf('/'))
    importArray.forEach(segment => {
        if (segment === '..') {
            newPath = newPath.substr(0, newPath.lastIndexOf('/'))
        } else {
            newPath = newPath.concat('/' + segment)
        }
    })
    return newPath
}

const convertRelativePathToAbsolute = (currentFilename, currentImport) => {
    const pathSegments = currentImport.split('/')
    if (pathSegments.includes('..')) {
        //in relative path
        const proposedAbsolutePath = applyRelativeImportToCurrentFilepath(currentFilename, pathSegments)
        currentImport = proposedAbsolutePath
    }

    const prefixesToDelete = ['/', './']
    prefixesToDelete.forEach(prefix => {
        currentImport = currentImport.startsWith(prefix) ? currentImport.substring(prefix.length, currentImport.length) : currentImport
    })
    return currentImport
}

const buildErrorMessage = (imp) => {
    let errorMsg = `Module ${imp.name} is deprecated.`
    if (imp.use) {
        errorMsg += ` Use ${imp.use} instead. `
    }
    return errorMsg
}

module.exports = {
    meta: {
        docs: {
            description: 'Forbids importing from given files.'
        },
    },
    create(context) {
        const imports = {}
        context.options.map(makeImportObj).forEach((importObj) => {
            imports[importObj.name] = importObj
        })

        return {
            ImportDeclaration(node) {
                const importPath = convertRelativePathToAbsolute(context.eslint.getFilename(), node.source.value)

                let imp
                for(let importString in imports) {
                    if(importString.includes(importPath)){
                        imp = imports[importString]
                        break
                    }
                }

                if (!imp) {
                    return
                }

                context.report({ node, message: buildErrorMessage(imp) })
            },
            CallExpression(node) {
                if (node.callee.name !== 'require' || !node.arguments.length) {
                    return
                }
                const requireArg = node.arguments[0]
                if (requireArg.type !== 'Literal') {
                    return
                }
                const imp = imports[requireArg.value]

                if (!imp) {
                    return
                }
                context.report({ node, message: buildErrorMessage(imp) })
            }
        }
    }
}
