/**
 * Asserts that value is truthy.
 *
 * @param value - Value to check.
 * @param message - Optional error message to throw.
 */
export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(message ? message : 'unreachable');
  }
}
