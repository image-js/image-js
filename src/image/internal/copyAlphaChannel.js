/**
 * Copies the alpha channel from an image to another. no-op if one of the images has no alpha
 * @private
 * @param {Image} from
 * @param {Image} to
 */
export default function copyAlphaChannel(from, to) {
  if (from.alpha === 1 && to.alpha === 1) {
    for (let i = 0; i < from.size; i++) {
      to.data[i * to.channels + to.components] =
        from.data[i * from.channels + from.components];
    }
  }
}
