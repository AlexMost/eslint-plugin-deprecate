[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct.svg)](https://stand-with-ukraine.pp.ua)

# eslint-plugin-deprecate

[![NPM version](http://img.shields.io/npm/v/eslint-plugin-deprecate.svg)](https://www.npmjs.com/package/eslint-plugin-deprecate)
![downloads](https://img.shields.io/npm/dm/eslint-plugin-deprecate.svg)

This plugin helps you to refactor your codebase.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-deprecate`:

```
$ npm install eslint-plugin-deprecate --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-deprecate` globally.

## ESLint 9 support

**ESLint 9** and **flat config** (`eslint.config.js`) are supported starting from **version 0.9.0**. If you use ESLint 9 or the new flat config format, install `eslint-plugin-deprecate@0.9.0` or later. For ESLint 8 and legacy `.eslintrc`, any 0.8.x or 0.9.x release is compatible.

## Usage

Add `deprecate` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "deprecate"
    ]
}
```

Then configure the rules you want to use under the rules section. Pass each deprecated item as an option (no nested array):

```json
{
    "rules": {
        "deprecate/function": ["error", { "name": "oldFn", "use": "newFn" }],
        "deprecate/import": ["warn", "Legacy"],
        "deprecate/member-expression": ["error", "React.createClass"]
    }
}
```

With multiple items, list them after the severity:

```json
{
    "rules": {
        "deprecate/function": [
            "error",
            { "name": "ungettext", "use": "ngettext from ttag" },
            { "name": "get_config", "use": "getConfig from 'libconfig'" }
        ],
        "deprecate/member-expression": [
            "error",
            { "name": "React.createClass", "use": "native es6 classes" },
            { "name": "React.PropTypes", "use": "'prop-types' package" }
        ]
    }
}
```

**Flat config (ESLint 9):** With `eslint.config.js`, use:

```js
import deprecate from 'eslint-plugin-deprecate';

export default [
  {
    plugins: { deprecate },
    rules: {
      'deprecate/function': ['error', { name: 'oldFn', use: 'newFn' }],
    },
  },
];
```

## Supported Rules

* [deprecate/function](docs/rules/function.md): Warn about some function usage.
* [deprecate/member-expression](docs/rules/member-expression.md): Warn about some member expression usages.
* [deprecate/import](docs/rules/import.md): Warn about some import/require usage.
