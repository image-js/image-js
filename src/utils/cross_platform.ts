/**
 * Returns builtin Node.js modules or throws an error saying that the method is only implemented in Node.js.
 * @param methodName - Name of the method that calls this function
 * @returns - The `fs`, `path` and `url` Node.js modules.
 */
export function getNodeApiOrThrow(methodName: string) {
  if (
    typeof process === 'undefined' ||
    typeof process.getBuiltinModule !== 'function'
  ) {
    throw new Error(`${methodName} is only implemented for Node.js`);
  }
  return {
    fs: process.getBuiltinModule('node:fs'),
    path: process.getBuiltinModule('node:path'),
    url: process.getBuiltinModule('node:url'),
  };
}
