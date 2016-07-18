'use strict';

class SequenceId {
    constructor() {
        this.id = 0;
        this.map = new Map();
    }
    getId(value) {
        let id = this.map.get(value);
        if (!id) {
            id = ++this.id;
            this.map.set(value, id);
        }
        return id;
    }
}

module.exports = SequenceId;
