import Image from '../../../image/Image';

const defaultOptions = {
  regression: {
    kernelType: 'polynomial',
    kernelOptions: { degree: 2, constant: 1 }
  },
  threshold: 0.02,
  roi: {
    minSurface: 100,
    positive: false
  },
  sampling: 20,
  include: []
};

function run(image, options, onStep) {
  options = Object.assign({}, defaultOptions, options);
  const manager = this.manager;
  if (Array.isArray(image)) {
    return Promise.all(image.map(function (img) {
      const run = runOnce(manager, img, options);
      if (typeof onStep === 'function') {
        run.then(onStep);
      }
      return run;
    }));
  } else {
    return runOnce(manager, image, options);
  }
}

function runOnce(manager, image, options) {
  return manager.post('data', [image, options]).then(function (response) {
    for (let i in response) {
      response[i] = new Image(response[i]);
    }
    return response;
  });
}

function work() {
  worker.on('data', function (send, image, options) {
    image = new IJS(image);
    const result = {};
    const toTransfer = [];

    const grey = image.grey();

    const sobel = grey.sobelFilter();
    maybeInclude('sobel', sobel);

    const mask = sobel.level().mask({ threshold: options.threshold });
    maybeInclude('mask', mask);

    const roiManager = sobel.getRoiManager();
    roiManager.fromMask(mask);
    const realMask = roiManager.getMask(options.roi);
    maybeInclude('realMask', realMask);

    const pixels = grey.getPixelsGrid({
      sampling: options.sampling,
      mask: realMask
    });

    const background = image.getBackground(pixels.xyS, pixels.zS, options.regression);
    maybeInclude('background', background);

    const corrected = image.subtract(background);

    result.result = corrected;
    toTransfer.push(corrected.data.buffer);
    send(result, toTransfer);

    function maybeInclude(name, image) {
      if (options.include.includes(name)) {
        result[name] = image;
        toTransfer.push(image.data.buffer);
      }
    }
  });
}

const background = { run, work };
export default background;
