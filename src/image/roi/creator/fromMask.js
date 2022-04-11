import RoiMap from '../RoiMap';

/**
 * @memberof RoiManager
 * @instance
 * @param {Image} mask
 * @param {object} [options]
 * @return {RoiMap}
 */
export default function fromMask(mask, options = {}) {
  const { allowCorners = false } = options;

  const MAX_ARRAY = 0x00ffff; // 65535 should be enough for most of the cases

  // based on a binary image we will create plenty of small images
  let data = new Int16Array(mask.size); // maxValue: 32767, minValue: -32768

  // split will always return an array of images
  let positiveID = 0;
  let negativeID = 0;

  let xToProcess = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
  let yToProcess = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!

  for (let x = 0; x < mask.width; x++) {
    for (let y = 0; y < mask.height; y++) {
      if (data[y * mask.width + x] === 0) {
        // need to process the whole surface
        analyseSurface(x, y);
      }
    }
  }

  function analyseSurface(x, y) {
    let from = 0;
    let to = 0;
    let targetState = mask.getBitXY(x, y);
    let id = targetState ? ++positiveID : --negativeID;
    if (positiveID > 32767 || negativeID < -32768) {
      throw new Error('Too many regions of interest');
    }
    xToProcess[0] = x;
    yToProcess[0] = y;
    while (from <= to) {
      let currentX = xToProcess[from & MAX_ARRAY];
      let currentY = yToProcess[from & MAX_ARRAY];
      data[currentY * mask.width + currentX] = id;
      // need to check all around mask pixel
      if (
        currentX > 0 &&
        data[currentY * mask.width + currentX - 1] === 0 &&
        mask.getBitXY(currentX - 1, currentY) === targetState
      ) {
        // LEFT
        to++;
        xToProcess[to & MAX_ARRAY] = currentX - 1;
        yToProcess[to & MAX_ARRAY] = currentY;
        data[currentY * mask.width + currentX - 1] = -32768;
      }
      if (
        currentY > 0 &&
        data[(currentY - 1) * mask.width + currentX] === 0 &&
        mask.getBitXY(currentX, currentY - 1) === targetState
      ) {
        // TOP
        to++;
        xToProcess[to & MAX_ARRAY] = currentX;
        yToProcess[to & MAX_ARRAY] = currentY - 1;
        data[(currentY - 1) * mask.width + currentX] = -32768;
      }
      if (
        currentX < mask.width - 1 &&
        data[currentY * mask.width + currentX + 1] === 0 &&
        mask.getBitXY(currentX + 1, currentY) === targetState
      ) {
        // RIGHT
        to++;
        xToProcess[to & MAX_ARRAY] = currentX + 1;
        yToProcess[to & MAX_ARRAY] = currentY;
        data[currentY * mask.width + currentX + 1] = -32768;
      }
      if (
        currentY < mask.height - 1 &&
        data[(currentY + 1) * mask.width + currentX] === 0 &&
        mask.getBitXY(currentX, currentY + 1) === targetState
      ) {
        // BOTTOM
        to++;
        xToProcess[to & MAX_ARRAY] = currentX;
        yToProcess[to & MAX_ARRAY] = currentY + 1;
        data[(currentY + 1) * mask.width + currentX] = -32768;
      }
      if (allowCorners) {
        if (
          currentX > 0 &&
          currentY > 0 &&
          data[(currentY - 1) * mask.width + currentX - 1] === 0 &&
          mask.getBitXY(currentX - 1, currentY - 1) === targetState
        ) {
          // TOP LEFT
          to++;
          xToProcess[to & MAX_ARRAY] = currentX - 1;
          yToProcess[to & MAX_ARRAY] = currentY - 1;
          data[(currentY - 1) * mask.width + currentX - 1] = -32768;
        }
        if (
          currentX < mask.width - 1 &&
          currentY > 0 &&
          data[(currentY - 1) * mask.width + currentX + 1] === 0 &&
          mask.getBitXY(currentX + 1, currentY - 1) === targetState
        ) {
          // TOP RIGHT
          to++;
          xToProcess[to & MAX_ARRAY] = currentX + 1;
          yToProcess[to & MAX_ARRAY] = currentY - 1;
          data[(currentY - 1) * mask.width + currentX + 1] = -32768;
        }
        if (
          currentX > 0 &&
          currentY < mask.height - 1 &&
          data[(currentY + 1) * mask.width + currentX - 1] === 0 &&
          mask.getBitXY(currentX - 1, currentY + 1) === targetState
        ) {
          // BOTTOM LEFT
          to++;
          xToProcess[to & MAX_ARRAY] = currentX - 1;
          yToProcess[to & MAX_ARRAY] = currentY + 1;
          data[(currentY + 1) * mask.width + currentX - 1] = -32768;
        }
        if (
          currentX < mask.width - 1 &&
          currentY < mask.height - 1 &&
          data[(currentY + 1) * mask.width + currentX + 1] === 0 &&
          mask.getBitXY(currentX + 1, currentY + 1) === targetState
        ) {
          // BOTTOM RIGHT
          to++;
          xToProcess[to & MAX_ARRAY] = currentX + 1;
          yToProcess[to & MAX_ARRAY] = currentY + 1;
          data[(currentY + 1) * mask.width + currentX + 1] = -32768;
        }
      }

      from++;

      if (to - from > MAX_ARRAY) {
        throw new Error(
          'analyseMask can not finish, the array to manage internal data is not big enough.' +
            'You could improve mask by changing MAX_ARRAY',
        );
      }
    }
  }

  return new RoiMap(mask, data);
}
