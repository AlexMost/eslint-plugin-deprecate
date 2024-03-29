# Prevents some module import (require) 

## Rule Details

This rule allows you to forbid some module import and to suggest some alternative.
You must supply the path to the file from the root. This prevents errors caused by having multiple files with the same name in different directories.

### Example:
Let's consider we have this configuration in `.eslintrc`:

```json
{
  "plugins": ["deprecate"],
  "rules": {
    "deprecate/import": ["error",
      {"name": "path/to/legacyModule", "use": "newModule"},
      {"name": "a", "module": "path/to/legacyModule", "use": "newModule"},
      {"nameRegExp": "\\.sss", "use": "css imports"},
    ]
  }
}
```

### The following patterns are considered as errors:

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
You can just pass deprecated modules names as strings:

```js
"deprecate/import": [ 2, "<mod name1>", "<mod name2>"]
```

If you want more control over displayed errors (suggest alternative module import e.t.c)
you can pass objects instead of just modules names:

```js
"deprecate/import": [ 2, 
    {"name": "<import name>", "use": "<suggested alternative>"}, ... ]
```

You can control named imports from some module:

```js
"deprecate/import": [ 2, 
    {"name": "<named import>", "module": "<name of module>", "use": "<suggested alternative>"}, ... ]
```

or use `nameRegExp`:

```js
"deprecate/import": [ 2, 
    {"nameRegExp": "<import name>", "use": "<suggested alternative>"}, ... ]
```

## When Not To Use It

When you don't want to forbid some modules usage in your codebase.
