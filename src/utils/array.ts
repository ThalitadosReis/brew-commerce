export function shallowArrayEqual(
  a?: readonly string[],
  b?: readonly string[]
) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export function keyFromSizes(sizes: readonly string[]) {
  // normalize to avoid ["M","L"] vs ["M","L"] stringifying each time
  return [...sizes].join("|");
}
