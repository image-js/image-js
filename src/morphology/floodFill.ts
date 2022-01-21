import { IJS, Mask } from '..';

export interface FloodFillOptions {
  /**
   * Consider pixels connected by corners?
   */
   allowCorners?: boolean;
   /**
    * Image to which the inverted image has to be put.
    */
   out?: Mask;

export function floodFill(mask: Mask, options: FloodFillOptions): Mask {
    let { allowCorners = false } = options;

  let newImage = maskToOutputMask(mask, options);


}
