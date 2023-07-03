class ImportChecker {
    constructor(option) {
        if (typeof option === 'string') {
            this.name = option;
            this.use = null;
            this.nameRegExp = null;
            this.module = null;
        } else {
            this.name = option.name || null;
            this.nameRegExp = option.nameRegExp || null;
            this.use = option.use || null;
            this.module = option.module || null;
        }

        this.regExp = this.nameRegExp ? new RegExp(this.nameRegExp) : null;

        if (this.name && this.nameRegExp) {
            throw new Error('You should provide one of "name" or "nameRegExp" in option');
        }
    }

    check(importPath, importModules) {
        if (this.module && importModules && importModules.size) {
            return importPath === this.module && importModules.has(this.name);
        }
        if (this.name) {
            return importPath === this.name;
        }
        if (this.regExp) {
            return Boolean(importPath.match(this.regExp));
        }
        throw new Error('You should provide "name" or "nameRegExp" as an option to plugin');
    }

    getErrMessage() {
        if (this.module && this.use && this.name) {
            const errorMsg = `${this.name} from ${this.module} is deprecated. Use ${this.use} instead.`;
            return errorMsg;
        }
        if (this.name) {
            let errorMsg = `Module ${this.name} is deprecated.`;
            if (this.use) {
                errorMsg += ` Use ${this.use} instead.`;
            }
            return errorMsg;
        }
        let errorMsg = `Import pattern '${this.nameRegExp}' is deprecated.`;
        if (this.use) {
            errorMsg += ` Use ${this.use} instead.`;
        }
        return errorMsg;
    }
}

module.exports = ImportChecker;
