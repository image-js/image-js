import WorkerManager from 'web-worker-manager';

import extend from './extend';

class Worker {
  constructor() {
    this._url = null;
    this._deps = [null];
  }
  checkUrl() {
    if (this._url === null) {
      throw new Error('image worker must be initialized with an URL');
    }
  }
  get url() {
    return this._url;
  }
  set url(value) {
    if (typeof value !== 'string') {
      throw new TypeError('worker URL must be a string');
    }
    this._url = value;
    this._deps[0] = value;
  }
  static extendMethod(name, method) {
    let manager;
    let url;
    let runner = {};

    function run(...args) {
      if (!manager) {
        this.checkUrl();
        url = this.url;
        manager = new WorkerManager(method.work, { deps: url });
        runner.manager = manager;
      }
      return method.run.call(runner, ...args);
    }

    run.reset = function () {
      if (manager) {
        manager.terminate();
        manager = new WorkerManager(method.work, { deps: url });
        runner.manager = manager;
      }
    };
    Worker.prototype[name] = run;
  }
}

extend(Worker);

export default new Worker();
