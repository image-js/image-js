import {Image, load} from 'test/common';
import {createCanvas} from 'canvas';
import 'should';

describe('Image core', () => {
    it('constructor defaults', () => {
        let img = new Image();
        img.width.should.equal(1);
        img.height.should.equal(1);
        img.data.length.should.equal(4);
    });

    it('invalid constructor use', () => {
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

    it('construct with a kind', () => {
        const img = new Image(1, 1, {kind: 'RGB'});
        expect(img.data.length).toBe(3);
    });

    it('construct a 32bit image', () => {
        const img = new Image(1, 1, {bitDepth: 32});
        expect(img.bitDepth).toBe(32);
        expect(img.data).toBeInstanceOf(Float32Array);
        expect(img.maxValue).toBe(Number.MAX_VALUE);
    });

    it('wrong array passed to setData', () => {
        const img = new Image(1, 1);
        expect(() => {
            img.setData([1]);
        }).toThrow('incorrect data size. Should be 4 and found 1');
    });

    it('create from Canvas', () => {
        let canvas = createCanvas(2, 2);
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

    it('should clone', async () => {
        const img = await load('format/rgba32.png');
        const clone = img.clone();
        clone.should.be.an.instanceOf(Image);
        clone.should.not.be.equal(img);
        clone.data.should.not.equal(img.data);
        clone.toDataURL().should.equal(img.toDataURL());
    });

    it('should clone and keep same data', async () => {
        const img = await load('format/rgba32.png');
        const clone = img.clone({copyData: false});
        clone.should.be.an.instanceOf(Image);
        clone.should.not.be.equal(img);
        clone.data.should.equal(img.data);
        clone.toDataURL().should.equal(img.toDataURL());
    });

    it('isImage', function () {
        const image = new Image(5, 5);
        Image.isImage(image).should.be.true();
        Image.isImage().should.be.false();
        Image.isImage({}).should.be.false();
    });
});
