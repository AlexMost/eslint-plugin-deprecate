# Prevents some function usage

## Rule Details

This rule allows you to forbid some function usage and to suggest some alternative.
Useful for large teams while refactoring a codebase.

Options are passed as a list after the severity (no nested array). Each item may be a string (deprecated name only) or an object with `name` and optional `use` (suggested alternative).

### Example

`.eslintrc` or flat config:

```json
{
  "plugins": ["deprecate"],
  "rules": {
    "deprecate/function": ["error", { "name": "legacyFunc", "use": "newFunc from this package" }]
  }
}
```

### The following patterns are considered errors

```js
// any function call with name legacyFunc
console.log(legacyFunc());
legacyFunc();
```

## Options

Pass deprecated function names as strings (no replacement message):

```json
"deprecate/function": ["error", "legacyFunc", "otherDeprecatedFn"]
```

Or pass objects to suggest an alternative:

```json
"deprecate/function": [
  "error",
  { "name": "legacyFunc", "use": "newFunc from this package" },
  { "name": "oldHelper", "use": "use helper from 'utils/helper'" }
]
```

- **name** (required): The deprecated function name.
- **use** (optional): Message shown as the suggested alternative.

## When Not To Use It

When you don't want to forbid specific function usage in your codebase.
