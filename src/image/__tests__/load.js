import {Image, load} from 'test/common';
import Canvas from 'canvas';

describe('Image core', function () {
    it('constructor defaults', function () {
        let img = new Image();
        img.width.should.equal(1);
        img.height.should.equal(1);
        img.data.length.should.equal(4);
    });

    it('invalid constructor use', function () {
        (function () {
            new Image(0, 0);
        }).should.throw(/width must be greater than 0/);
        (function () {
            new Image(5, 0);
        }).should.throw(/height must be greater than 0/);
        (function () {
            new Image(10, 10, {kind: 'BLABLA'});
        }).should.throw(/invalid image kind: BLABLA/);
    });

    it('create from Canvas', function () {
        let canvas = new Canvas(2, 2);
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 2, 1);
        let img = Image.fromCanvas(canvas);
        Array.from(img.data).should.eql([
            255,   0,   0, 255, 255,   0,   0, 255,
            0,   0,   0,   0,   0,   0,   0,   0
        ]);
    });

    it('should load from URL', function () {
        return load('format/rgba32.png').then(function (img) {
            img.width.should.be.greaterThan(0);
            img.height.should.be.greaterThan(0);
            img.maxValue.should.equal(255);
        });
    });

    it('should load from dataURL', function () {
        // a red dot
        const dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
        return Image.load(dataURL).then(img => {
            img.width.should.equal(5);
            img.height.should.equal(5);
        });
    });

    it('should clone', function () {
        return load('format/rgba32.png').then(function (img) {
            let clone = img.clone();
            clone.should.be.an.instanceOf(Image);
            clone.should.not.be.equal(img);
            clone.toDataURL().should.equal(img.toDataURL());
        });
    });

    it('isImage', function () {
        const image = new Image(5, 5);
        Image.isImage(image).should.be.true();
        Image.isImage().should.be.false();
        Image.isImage({}).should.be.false();
    });
});
