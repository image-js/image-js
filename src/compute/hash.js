import newArray from 'new-array';
import SHA from 'sha.js';


export default function getHash() {
    if (! this.data) return undefined;
    var sha = new (SHA.sha256)();
    sha.update(this.data);
    return sha.digest('hex');
}
