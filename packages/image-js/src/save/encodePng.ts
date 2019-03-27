import { encode, IPNGEncoderOptions, IImageData } from 'fast-png';

import { Image } from '../Image';
import { kindDefinitions } from '../utils/kinds';

export function encodePng(
  image: Image,
  options?: IPNGEncoderOptions
): ArrayBufferView {
  const kindDef = kindDefinitions[image.kind];
  const data: IImageData = {
    width: image.width,
    height: image.height,
    channels: kindDef.channels,
    alpha: kindDef.alpha,
    bitDepth: image.depth,
    data: image.data
  };

  return encode(data, options);
}
