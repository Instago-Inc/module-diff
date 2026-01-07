# module/diff - V8 module

Use this module when you want a simple way to compare values and see what changed. It keeps output small and structured so it's easy to scan, log, or pass to downstream steps.

It runs in the hgi-v8 runtime without Node.js dependencies. Learn more at https://instago.ai.

## Technical reference

Exports:
- `diff(a, b)` -> `object|null`
- `applyTextDiff(textDiff)` -> `array|null`

Usage:
- `diff(a, b)` compares strings, arrays, plain objects, and primitives.
  - Strings return `{ type: 'text', changes: [{ line, before, after }] }` or `null`.
  - Arrays return `{ type: 'array', removed?, added?, changed? }` or `null`.
  - Objects return `{ type: 'object', changes }` or `null`.
  - Primitives return `{ before, after }` or `null`.
- `applyTextDiff(textDiff)` returns only text diff lines where `before` is falsy and `after` is truthy, or `null` for invalid input.

Configuration:
- No required or optional env keys in `env.json`.
- No `configure` function.

Examples:
```js
const { diff, applyTextDiff } = require('diff@latest');

const textDelta = diff('a', 'a\nb');
// => { type: 'text', changes: [{ line: 2, before: null, after: 'b' }] }

const addedLines = applyTextDiff(textDelta);
// => [{ line: 2, before: null, after: 'b' }]

const objDelta = diff({ a: 1 }, { a: 2, b: 3 });
// => { type: 'object', changes: { a: { before: 1, after: 2 }, b: { added: 3 } } }
```
