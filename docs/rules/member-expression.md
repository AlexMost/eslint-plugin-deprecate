# Prevents some member expressions usage 

## Rule Details

This rule allows you to forbid some member expression usage and suggests some alternative.
The good use case for this rule is for example when some library deprecates some of it's
api methods and suggest you to use other.

### Example:
Let's consider we have this configuration in `.eslintrc`:

```json
{
  "plugins": ["deprecate"],
  "rules": {
    "deprecate/member-expression": ["error",
      {"name": "React.createClass", "use": "native es6 classes"}
    ]
  }
}
```

### The following patterns are considered as errors:

```js
import React from 'react';

// React.createClass is deprecated
var Component = React.createClass({
  mixins: [MixinA],
  render() {
    return <Child />;
  }
});
```

## Options
You can just pass deprecated member expression strings as strings:

```js
"deprecate/member-expression": [ 2, "<member expression str1>", "<member expression str1>"]
```

If you want more control over displayed errors (suggest alternative module import e.t.c)
you can pass objects instead of just modules names:

```js
"deprecate/member-expression": [ 2, 
    {"name": "<member expression str1>", "use": "<suggested alternative>"}, ... ]
```
> name key is used for consistency with other deprecate functions

## When Not To Use It

When you don't want to forbid some member expressions in your code.
