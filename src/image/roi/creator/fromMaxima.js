import RoiMap from '../RoiMap';

/**
 * @memberof RoiManager
 * @instance
 * @param {object} [options]
 * @param {boolean} [options.allowCorner=true]
 * @param {boolean} [options.onlyTop=false]
 * @param {boolean} [options.invert=false]
 * @return {RoiMap}
 */
export default function fromMaxima(options = {}) {
  let { allowCorner = true, onlyTop = false, invert = false } = options;

  let image = this;
  image.checkProcessable('fromMaxima', { components: [1] });

  const PROCESS_TOP = 1;
  const PROCESS_NORMAL = 2;

  // split will always return an array of images
  let positiveID = 0;
  let negativeID = 0;

  let data = new Int16Array(image.size); // maxValue: 32767, minValue: -32768
  let processed = new Int8Array(image.size);
  let variations = new Float32Array(image.size);

  let MAX_ARRAY = 0x0fffff; // should be enough for most of the cases
  let xToProcess = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
  let yToProcess = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!

  let from = 0;
  let to = 0;

  let xToProcessTop = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
  let yToProcessTop = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!

  let fromTop = 0;
  let toTop = 0;

  appendMaxima(image, { maxima: !invert });

  while (from < to) {
    let currentX = xToProcess[from & MAX_ARRAY];
    let currentY = yToProcess[from & MAX_ARRAY];
    process(currentX, currentY, PROCESS_NORMAL);
    from++;
  }

  return new RoiMap(image, data);

  // we will look for the maxima (or minima) that is present in the picture
  // a maxima is a point that is surrounded by lower values
  // should deal with allowCorner and invert
  function appendMaxima({ maxima = true }) {
    for (let y = 1; y < image.height - 1; y++) {
      for (let x = 1; x < image.width - 1; x++) {
        let index = x + y * image.width;
        if (processed[index] === 0) {
          let currentValue = maxima
            ? image.data[index]
            : -image.data[x + y * image.width];
          if (image.data[y * image.width + x - 1] > currentValue) {
            // LEFT
            continue;
          }
          if (image.data[y * image.width + x + 1] > currentValue) {
            // RIGHT
            continue;
          }
          if (image.data[(y - 1) * image.width + x] > currentValue) {
            // TOP
            continue;
          }
          if (image.data[(y + 1) * image.width + x] > currentValue) {
            // BOTTOM
            continue;
          }
          if (allowCorner) {
            if (image.data[(y - 1) * image.width + x - 1] > currentValue) {
              // LEFT TOP
              continue;
            }
            if (image.data[(y - 1) * image.width + x + 1] > currentValue) {
              // RIGHT TOP
              continue;
            }
            if (image.data[(y + 1) * image.width + x - 1] > currentValue) {
              // LEFT BOTTOM
              continue;
            }
            if (image.data[(y + 1) * image.width + x + 1] > currentValue) {
              // RIGHT BOTTOM
              continue;
            }
          }

          data[index] = maxima ? ++positiveID : --negativeID;

          let valid = processTop(x, y, PROCESS_TOP);
          if (!valid) {
            if (maxima) {
              --positiveID;
            } else {
              ++negativeID;
            }
          }
        }
      }
    }
  }

  // we will try to get all the points of the top (same value)
  // and to check if the whole group is surrounded by lower value
  // as soon as one of them if not part we need to reverse the process
  // and just for get those points
  function processTop(xToProcess, yToProcess) {
    let currentTo = to; // in case if fails we come back
    fromTop = 0;
    toTop = 1;
    xToProcessTop[0] = xToProcess;
    yToProcessTop[0] = yToProcess;
    let valid = true;
    while (fromTop < toTop) {
      let currentX = xToProcessTop[fromTop & MAX_ARRAY];
      let currentY = yToProcessTop[fromTop & MAX_ARRAY];
      valid &= process(currentX, currentY, PROCESS_TOP);
      fromTop++;
    }
    if (!valid) {
      // need to clear all the calculated data because the top is not surrounded by negative values
      for (let i = 0; i < toTop; i++) {
        let currentX = xToProcessTop[i & MAX_ARRAY];
        let currentY = yToProcessTop[i & MAX_ARRAY];
        let index = currentY * image.width + currentX;
        data[index] = 0;
      }
      to = currentTo;
    }
    return valid;
  }

  /*
     For a specific point we will check the points around, increase the area of interests and add
     them to the processing list
     type=0 : top
     type=1 : normal
     */
  function process(xCenter, yCenter, type) {
    let currentID = data[yCenter * image.width + xCenter];
    let currentValue = image.data[yCenter * image.width + xCenter];
    for (let y = yCenter - 1; y <= yCenter + 1; y++) {
      for (let x = xCenter - 1; x <= xCenter + 1; x++) {
        let index = y * image.width + x;
        if (processed[index] === 0) {
          processed[index] = 1;
          // we store the variation compare to the parent pixel
          variations[index] = image.data[index] - currentValue;
          switch (type) {
            case PROCESS_TOP:
              if (variations[index] === 0) {
                // we look for maxima
                // if we are next to a border ... it is not surrounded !
                if (
                  x === 0 ||
                  y === 0 ||
                  x === image.width - 1 ||
                  y === image.height - 1
                ) {
                  return false;
                }
                data[index] = currentID;
                xToProcessTop[toTop & MAX_ARRAY] = x;
                yToProcessTop[toTop & MAX_ARRAY] = y;
                toTop++;
              } else if (variations[index] > 0) {
                // not a global maximum
                return false;
              } else {
                // a point we will have to process
                if (!onlyTop) {
                  data[index] = currentID;
                  xToProcess[to & MAX_ARRAY] = x;
                  yToProcess[to & MAX_ARRAY] = y;
                  to++;
                }
              }
              break;
            case PROCESS_NORMAL:
              if (variations[index] <= 0) {
                // we look for maxima
                data[index] = currentID;
                xToProcess[to & MAX_ARRAY] = x;
                yToProcess[to & MAX_ARRAY] = y;
                to++;
              }
              break;
            default:
              throw new Error('unreachable');
          }
        }
      }
    }
    return true;
  }
}
