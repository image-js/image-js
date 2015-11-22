function run(image, options) {
    const manager = this.manager;
    if (Array.isArray(image)) {
        return Promise.all(image.map(function (img) {
            return runOnce(manager, img, options);
        }));
    } else {
        return runOnce(manager, image, options);
    }
}

function runOnce(manager, image, options) {
    return manager.post('data', [image, options]).then(function (response) {
        return new IJS(response);
    });
}

function work() {
    worker.on('data', function (send, image, options) {
        image = new IJS(image);
        const grey = image.grey();
        const bg = localizeBackground(grey, options);
        const background = image.getBackground(bg.xyS, bg.zS, options.backgroundOptions);
        const corrected = image.subtract(background);
        send(corrected, corrected.data.buffer);
    });

    function localizeBackground(image, options) {
        const sobel = image.sobelFilter();
        const mask = sobel.level().mask({threshold: options.backgroundThreshold});
        const roiManager = sobel.getROIManager();
        roiManager.putMask(mask);
        const realMask = roiManager.getMask(options.backgroundRoiOptions);
        const pixels = image.getPixelsGrid({
            sampling: options.backgroundSampling,
            mask: realMask
        });
        return pixels;
    }
}

export default {run, work};
