import {Image} from '../common';


describe('map a binary image (mask) 2 x 2', function () {
    let data=new Uint8Array(1);
    data[0]=192;

    let img=new Image(2,2, data, {
        kind: 'BINARY'
    });

    let roiManager=img.getROIManager();
    roiManager.putMask(img);
    let pixels=roiManager.getPixels();
    let result=roiManager.getROIMap();

    it('should have 4 pixels in 2 zones', function () {
        pixels.should.instanceOf(Int16Array).and.have.lengthOf(4);
        pixels[0].should.equal(1);
        pixels[1].should.equal(1);
        pixels[2].should.equal(-1);
        pixels[3].should.equal(-1);
    });

    it('should have 2 zones, one positive, one negative', function () {
        result.total.should.equal(2);
        result.negative.should.equal(1);
        result.positive.should.equal(1);
    });

});

describe('map a binary image 4 x 4 in 2 zones', function () {
    let data=new Uint8Array(2);
    data[0]=255;
    data[1]=0;

    let img=new Image(4,4, data, {
        kind: 'BINARY'
    });

    let roiManager=img.getROIManager();
    roiManager.putMask(img);
    let pixels=roiManager.getPixels();
    let result=roiManager.getROIMap();

    it('should have 16 pixels in 2 zones', function () {
        pixels.should.instanceOf(Int16Array).and.have.lengthOf(16);
        pixels[0].should.equal(1);
        pixels[7].should.equal(1);
        pixels[8].should.equal(-1);
        pixels[15].should.equal(-1);
    });

    it('should have 2 zones, one positive, one negative', function () {
        result.total.should.equal(2);
        result.negative.should.equal(1);
        result.positive.should.equal(1);
    });

});

describe('map a binary image 4 x 4 in 2 zones', function () {
    let data=new Uint8Array(2);
    data[0]=63;
    data[1]=192;

    let img=new Image(4,4, data, {
        kind: 'BINARY'
    });

    let roiManager=img.getROIManager();
    roiManager.putMask(img);
    let pixels=roiManager.getPixels();
    let result=roiManager.getROIMap();

    it('should have 16 pixels in 3 zones', function () {
        pixels.should.instanceOf(Int16Array).and.have.lengthOf(16);
        pixels[0].should.equal(-1);
        pixels[1].should.equal(-1);
        pixels[2].should.equal(1);
        pixels[9].should.equal(1);
        pixels[10].should.equal(-2);
        pixels[15].should.equal(-2);
    });

    it('should have 3 zones, one positive, two negative', function () {
        result.total.should.equal(3);
        result.negative.should.equal(2);
        result.positive.should.equal(1);
    });

});
