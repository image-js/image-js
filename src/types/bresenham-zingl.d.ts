declare module 'bresenham-zingl' {
  type SetPixel = (x: number, y: number) => void;
  type SetPixelAlpha = (x: number, y: number, alpha: number) => void;

  /**
   * Line segment rasterisation.
   * @param x0 - Starting point x coordinate.
   * @param y0 - Starting point y coordinate.
   * @param x1 - Ending point x coordinate.
   * @param y1 - Ending point y coordinate.
   * @param setPixel - Function to set a pixel.
   */
  export function line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    setPixel: SetPixel,
  ): void;

  /**
   * Draw anti-aliased line.
   * @param x0 - Starting point x coordinate.
   * @param y0 - Starting point y coordinate.
   * @param x1 - Ending point x coordinate.
   * @param y1 - Ending point y coordinate.
   * @param setPixel - Function to set a pixel with alpha.
   */
  export function lineAA(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    setPixel: SetPixelAlpha,
  ): void;

  /**
   * Circle rasterisation.
   * @param xm - Circle center x.
   * @param ym - Circle center y.
   * @param r - Circle radius.
   * @param setPixel - Set pixel function.
   */
  export function circle(
    xm: number,
    ym: number,
    r: number,
    setPixel: SetPixel,
  ): void;
}
