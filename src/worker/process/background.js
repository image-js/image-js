import WorkerManager from 'web-worker-manager';

var manager;

export default function background(image) {
    if (!manager) {
        manager = new WorkerManager(insideBackgroundWorker, {
            deps: this._deps
        });
    }
    manager.post('data').then(function (response) {
        console.log(new IJS(response));
    });
}

function insideBackgroundWorker() {
    worker.on('data', function (send) {
        var image = new IJS(5, 5);
        send(image, image.data.buffer);
    });
}
