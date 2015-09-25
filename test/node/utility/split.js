import {Image} from '../common';

describe('split an image of 3 components and keep alpha', function () {
    let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);
    let images = image.split();

    it('should yield 3 grey images with alpha', function () {
        images.should.instanceOf(Array).and.have.lengthOf(3);
        images[0].components.should.equal(1);
        images[0].channels.should.equal(2);
    });

    it('check values of the 3 images', function () {
        images[0].data[0].should.equal(230);
        images[0].data[1].should.equal(255);
        images[0].data[2].should.equal(100);
        images[0].data[3].should.equal(240);
        images[1].data[0].should.equal(83);
        images[1].data[1].should.equal(255);
        images[1].data[2].should.equal(140);
        images[1].data[3].should.equal(240);
        images[2].data[0].should.equal(120);
        images[2].data[1].should.equal(255);
        images[2].data[2].should.equal(13);
        images[2].data[3].should.equal(240);
    });
});

describe('split an image of 3 components and have alpha separately', function () {
    let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);
    let images = image.split({preserveAlpha: false});

    it('should yield 4 grey images with alpha', function () {
        images.should.instanceOf(Array).and.have.lengthOf(4);
        images[0].components.should.equal(1);
        images[0].channels.should.equal(1);
    });

    it('check values of the 4 images', function () {
        images[0].data[0].should.equal(230);
        images[0].data[1].should.equal(100);
        images[1].data[0].should.equal(83);
        images[1].data[1].should.equal(140);
        images[2].data[0].should.equal(120);
        images[2].data[1].should.equal(13);
        images[3].data[0].should.equal(255);
        images[3].data[1].should.equal(240);
    });
});

