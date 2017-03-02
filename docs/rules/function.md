# Prevents some function usage 

## Rule Details

This rule allows you to forbid some function usage and to suggest some alternative.
Maybe really handy for large teams while refactoring codebase.

### Example:
Let's consider we have this configuration in `.eslintrc`:

```json
{
  "plugins": ["deprecate"],
  "rules": {
    "deprecate/function": ["error",
      {"name": "legacyFunc", "use": "newFunc from this package"}
    ]
  }
}
```

### The following patterns are considered as errors:

```js
// any function call with name legacyFunc
console.log(legacyFunc());
legacyFunc();
```

## Options
You can just pass deprecated function names as strings:

```js
"deprecate/function": [ 2, "<fn name1>", "<fn name2>"]
```

If you want more control over displayed errors (suggest alternative function e.t.c)
you can pass objects instead of just function names:

```js
"deprecate/function": [ 2, 
    {"name": "<fn name>", "use": "<suggested alternative>"}, ... ]
```

## When Not To Use It

When you don't want to forbid some function usage in your codebase.
