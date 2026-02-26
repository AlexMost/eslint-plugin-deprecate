# Prevents some member expression usage

## Rule Details

This rule allows you to forbid some member expression usage and suggest an alternative.
A typical use case is when a library deprecates API methods and recommends replacements.

Options are passed as a list after the severity (no nested array). Each item may be a string (e.g. `"React.createClass"`) or an object with `name` and optional `use` (suggested alternative).

### Example

`.eslintrc` or flat config:

```json
{
  "plugins": ["deprecate"],
  "rules": {
    "deprecate/member-expression": ["error", { "name": "React.createClass", "use": "native es6 classes" }]
  }
}
```

### The following patterns are considered errors

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

Pass deprecated member expressions as strings (e.g. `"Object.prop"`):

```json
"deprecate/member-expression": ["error", "React.createClass", "React.PropTypes"]
```

Or pass objects to suggest an alternative:

```json
"deprecate/member-expression": [
  "error",
  { "name": "React.createClass", "use": "native es6 classes or create-react-class package" },
  { "name": "React.PropTypes", "use": "'prop-types' package" }
]
```

- **name** (required): The deprecated member expression (e.g. `"React.createClass"`).
- **use** (optional): Message shown as the suggested alternative.

## When Not To Use It

When you don't want to forbid specific member expressions in your code.
