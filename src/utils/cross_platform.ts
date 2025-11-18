import type {
  Canvas as SkiaCanvas,
  CanvasRenderingContext2D as SkiaCanvasRenderingContext2D,
} from 'skia-canvas';

/**
 * Returns builtin Node.js modules or throws an error saying that the method is only implemented in Node.js.
 * @param methodName - Name of the method that calls this function
 * @returns - The `fs`, `path` and `url` Node.js modules.
 */
export function getNodeApiOrThrow(methodName: string) {
  if (!isNode()) {
    throw new Error(`${methodName} is only implemented for Node.js`);
  }
  return {
    fs: process.getBuiltinModule('node:fs'),
    path: process.getBuiltinModule('node:path'),
    url: process.getBuiltinModule('node:url'),
  };
}

let CanvasCtorBrowser: typeof OffscreenCanvas;
let CanvasCtorNode: typeof SkiaCanvas;

/**
 * Returns a 2D canvas context for rendering on the browser or Node.js.
 * @param width - Width of the canvas.
 * @param height - Height of the canvas.
 * @returns The initialised canvas context.
 */
export function getCanvasContext(
  width: number,
  height: number,
): OffscreenCanvasRenderingContext2D | SkiaCanvasRenderingContext2D {
  if (isNode()) {
    CanvasCtorNode ??= getRequireFn()('skia-canvas').Canvas;
    return new CanvasCtorNode(width, height).getContext('2d');
  } else {
    CanvasCtorBrowser ??= globalThis.OffscreenCanvas;
    const context = new CanvasCtorBrowser(width, height).getContext('2d');
    if (!context) {
      throw new Error('Failed to create canvas context');
    }
    return context;
  }
}

function isNode() {
  return (
    typeof process !== 'undefined' &&
    typeof process.getBuiltinModule === 'function'
  );
}

let requireFn: NodeJS.Require;
function getRequireFn() {
  requireFn ??= process
    .getBuiltinModule('node:module')
    .createRequire(import.meta.url);
  return requireFn;
}
