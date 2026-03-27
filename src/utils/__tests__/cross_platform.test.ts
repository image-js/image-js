import Module from 'node:module';

import { describe, expect, it, vi } from 'vitest';

describe('getCanvasContext', () => {
  it('throws a helpful error when skia-canvas is not installed', async () => {
    const originalCreateRequire = Module.createRequire;
    vi.spyOn(Module, 'createRequire').mockImplementation((url) => {
      const realRequire = originalCreateRequire(url);
      return Object.assign((id: string) => {
        if (id === 'skia-canvas') {
          throw new Error("Cannot find module 'skia-canvas'");
        }
        return realRequire(id);
      }, realRequire) as NodeJS.Require;
    });

    // Reset modules to get a fresh cross_platform with no cached CanvasCtorNode
    vi.resetModules();
    const { getCanvasContext } = await import('../cross_platform.ts');

    expect(() => getCanvasContext(100, 100)).toThrowError(
      'drawText on Node.js requires the optional "skia-canvas" package',
    );

    vi.restoreAllMocks();
  });
});
