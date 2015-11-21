function run(image, options) {
    return this.manager.post('data', [image, options]).then(function (response) {
        return new IJS(response);
    });
}

function work() {
    worker.on('data', function (send, image, options) {
        image = new IJS(image);
        const grey = image.grey();
        send(grey, grey.data.buffer);
    });
}

export default {run, work};
