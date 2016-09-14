import {Image} from 'test/common';
import Canvas from 'canvas';


describe.skip('Image core toBlob', function () {
    it('constructor defaults', function () {
        let canvas = new Canvas(2, 2);
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 2, 1);
        let img = Image.fromCanvas(canvas);
        return img.toBlob().then(function (blob) {

        });
    });
});
