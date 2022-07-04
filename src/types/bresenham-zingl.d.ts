declare module 'bresenham-zingl' {
  type SetPixel = (x: number, y: number) => void;
  type SetPixelAlpha = (x: number, y: number, alpha: number) => void;
  export function line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    setPixel: SetPixel,
  ): void;

  export function lineAA(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    setPixel: SetPixelAlpha,
  ): void;
}
