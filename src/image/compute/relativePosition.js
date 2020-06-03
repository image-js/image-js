/**
 * An image may be derived from another image either by a crop
 * or because it is a ROI (region of interest)
 * Also a region of interest can be reprocessed to generated another
 * set of region of interests.
 * It is therefore important to keep the hierarchy of images to know
 * which image is derived from which one and be able to get the
 * relative position of one image in another
 * This methods takes care of this.
 * @memberof Image
 * @instance
 * @param {Image} targetImage
 * @param {object} [options={}]
 * @param {boolean} [options.defaultFurther=false] If set to true and no parent found returns the relative position
 *      to the further parent
 * @return {number[]|boolean}
 */
export default function getRelativePosition(targetImage, options = {}) {
  if (this === targetImage) {
    return [0, 0];
  }
  let position = [0, 0];

  let currentImage = this;
  while (currentImage) {
    if (currentImage === targetImage) {
      return position;
    }
    if (currentImage.position) {
      position[0] += currentImage.position[0];
      position[1] += currentImage.position[1];
    }
    currentImage = currentImage.parent;
  }
  // we should never reach this place, this means we could not find the parent
  // throw Error('Parent image was not found, can not get relative position.')
  if (options.defaultFurther) return position;

  return false;
}
