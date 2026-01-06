# module/diff - V8 module

Get a quick, structured view of what changed between two values without pulling in heavy tooling. This module focuses on clarity and compact output so you can use diffs in logs, workflow decisions, or light auditing.

It is built for the hgi-v8 runtime and works without Node.js dependencies. Learn more at https://instago.ai.

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
- `applyTextDiff(textDiff)` returns only added lines from a text diff, or `null` for invalid input.

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
