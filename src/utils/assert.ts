/**
 * Asserts that value is truthy.
 * @param value - Value to check.
 * @param message - Optional error message to throw.
 */
export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(message || 'unreachable');
  }
}

/**
 * Makes sure that all cases are handled
 * @param x - cases of value to check
 */
export function assertUnreachable(x: never): never {
  throw new Error(`unreachable: ${String(x)}`);
}
