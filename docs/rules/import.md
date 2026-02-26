# Prevents some module import (require)

## Rule Details

This rule allows you to forbid certain module imports and suggest alternatives.
Supply the path to the file from the root to avoid confusion when multiple files share the same name in different directories.

Options are passed as a list after the severity (no nested array). Each item may be a string (module path or name) or an object with `name`, `nameRegExp`, `use`, and/or `module`.

### Example

`.eslintrc` or flat config:

```json
{
  "plugins": ["deprecate"],
  "rules": {
    "deprecate/import": [
      "error",
      { "name": "path/to/legacyModule", "use": "newModule" },
      { "name": "a", "module": "path/to/legacyModule", "use": "newModule" },
      { "nameRegExp": "\\.sss$", "use": "css imports" }
    ]
  }
}
```

### The following patterns are considered errors

```js
import a from 'path/to/legacyModule'
import a from '../../path/to/legacyModule'
import a from 'legacyModule'
import { a } from 'path/to/legacyModule'

const a = require('path/to/legacyModule');
const a = require('../../path/to/legacyModule');
const a = require('legacyModule');
const { a } = require('legacyModule');
const a = require('legacyModule').a;

import style from 'style.sss'
```

## Options

Pass deprecated module names or paths as strings:

```json
"deprecate/import": ["error", "path/to/legacyModule", "otherLegacy"]
```

Or use objects for more control (suggested alternative, named imports, or regex):

**Simple: name + optional use**

```json
"deprecate/import": ["error", { "name": "legacyModule", "use": "newModule" }]
```

**Named import from a specific module** (forbid importing `navigate` from `gatsby`):

```json
"deprecate/import": ["error", { "name": "navigate", "module": "gatsby", "use": "utils/navigate" }]
```

**Match by regex** (e.g. forbid `.sss` imports):

```json
"deprecate/import": ["error", { "nameRegExp": "\\.sss$", "use": "css imports" }]
```

Object options:

- **name** (optional): Module path/name or named import to forbid.
- **nameRegExp** (optional): Regex pattern for module path (use either `name` or `nameRegExp`, not both).
- **module** (optional): When forbidding a named import, the module it must come from.
- **use** (optional): Message shown as the suggested alternative.

## When Not To Use It

When you don't want to forbid specific module usage in your codebase.
