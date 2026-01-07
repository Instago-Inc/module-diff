(function () {
  function isPlainObject(value) {
    return (
      Object.prototype.toString.call(value) === "[object Object]" &&
      value !== null
    );
  }

  function primitiveDiff(a, b) {
    if (Object.is(a, b)) return null;
    return { before: a, after: b };
  }

  function stringDiff(a, b) {
    if (a === b) return null;
    const aLines = String(a).split(/\r?\n/);
    const bLines = String(b).split(/\r?\n/);
    const max = Math.max(aLines.length, bLines.length);
    const changes = [];
    for (let i = 0; i < max; i++) {
      const before = aLines[i] ?? null;
      const after = bLines[i] ?? null;
      if (before === after) continue;
      changes.push({ line: i + 1, before, after });
    }
    return changes.length ? { type: "text", changes } : null;
  }

  function arrayDiff(a, b) {
    const removed = [];
    const added = [];
    const changed = [];
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      if (i >= a.length) {
        added.push({ index: i, value: b[i] });
        continue;
      }
      if (i >= b.length) {
        removed.push({ index: i, value: a[i] });
        continue;
      }
      const childDiff = diff(a[i], b[i]);
      if (childDiff) {
        changed.push({ index: i, delta: childDiff });
      }
    }
    if (!removed.length && !added.length && !changed.length) return null;
    const result = { type: "array" };
    if (removed.length) result.removed = removed;
    if (added.length) result.added = added;
    if (changed.length) result.changed = changed;
    return result;
  }

  function objectDiff(a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const changes = {};
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) {
        changes[key] = { removed: a[key] };
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(a, key)) {
        changes[key] = { added: b[key] };
        continue;
      }
      const childDiff = diff(a[key], b[key]);
      if (childDiff) {
        changes[key] = childDiff;
      }
    }
    return Object.keys(changes).length ? { type: "object", changes } : null;
  }

  function diff(a, b) {
    if (typeof a === "string" || typeof b === "string") {
      return stringDiff(String(a ?? ""), String(b ?? ""));
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      return arrayDiff(a, b);
    }

    if (isPlainObject(a) && isPlainObject(b)) {
      return objectDiff(a, b);
    }

    return primitiveDiff(a, b);
  }

  module.exports = {
    diff,
    applyTextDiff(textDiff) {
      if (!textDiff || textDiff.type !== "text" || !Array.isArray(textDiff.changes)) {
        return null;
      }
      return textDiff.changes.filter(change => !change.before && change.after);
    },
  };
})();
