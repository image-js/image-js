import {Image} from 'test/common';


describe('map a binary image (mask) 2 x 2', function () {
    let imageData = new Uint8Array(1);
    imageData[0] = 192;

    let img = new Image(2,2, imageData, {
        kind: 'BINARY'
    });

    let roiManager = img.getRoiManager();
    roiManager.fromMask(img);
    let data = roiManager.getData();
    let result = roiManager.getMap();

    data.sort(function (a,b) {
        return b - a;
    });

    it('should have 4 data in 2 zones', function () {
        data.should.instanceOf(Int16Array).and.have.lengthOf(4);
        data[0].should.equal(1);
        data[1].should.equal(1);
        data[2].should.equal(-1);
        data[3].should.equal(-1);
    });

    it('should have 2 zones, one positive, one negative', function () {
        result.total.should.equal(2);
        result.negative.should.equal(1);
        result.positive.should.equal(1);
    });

});

describe('map a binary image 4 x 4 in 2 zones', function () {
    let imageData = new Uint8Array(2);
    imageData[0] = 255;
    imageData[1] = 0;

    let img = new Image(4,4, imageData, {
        kind: 'BINARY'
    });

    let roiManager = img.getRoiManager();
    roiManager.fromMask(img);
    let data = roiManager.getData();
    let result = roiManager.getMap();

    it('should have 16 data in 2 zones', function () {
        data.should.instanceOf(Int16Array).and.have.lengthOf(16);
        data[0].should.equal(1);
        data[7].should.equal(1);
        data[8].should.equal(-1);
        data[15].should.equal(-1);
    });

    it('should have 2 zones, one positive, one negative', function () {
        result.total.should.equal(2);
        result.negative.should.equal(1);
        result.positive.should.equal(1);
    });

});

describe('map a binary image 4 x 4 in 2 zones', function () {
    let imageData = new Uint8Array(2);
    imageData[0] = 63;
    imageData[1] = 192;

    let img = new Image(4,4, imageData, {
        kind: 'BINARY'
    });

    let roiManager = img.getRoiManager();
    roiManager.fromMask(img);
    let data = roiManager.getData();
    let result = roiManager.getMap();

    it('should have 16 data in 3 zones', function () {
        data.should.instanceOf(Int16Array).and.have.lengthOf(16);
        data[0].should.equal(-1);
        data[1].should.equal(-1);
        data[2].should.equal(1);
        data[9].should.equal(1);
        data[10].should.equal(-2);
        data[15].should.equal(-2);
    });

    it('should have 3 zones, one positive, two negative', function () {
        result.total.should.equal(3);
        result.negative.should.equal(2);
        result.positive.should.equal(1);
    });

});
