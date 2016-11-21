import {Image} from 'test/common';

/*
Image

1100
1100
0011
0011

Should become

10
01

 */
describe('Can we resize a binary image', function () {
    it('check the result', function () {
        let binary = new Image(4, 4, [204, 51], {
            kind: 'BINARY'
        });
        let newImage = binary.resizeBinary(0.5);
        newImage.width.should.equal(2);
        newImage.height.should.equal(2);
        Array.from(newImage.data).should.eql([144]);
        newImage.position.should.eql([1, 1]);
    });

    it.only('check the result fi size should be 0', function () {
        let binary = new Image(4, 4, [204, 51], {
            kind: 'BINARY'
        });
        let newImage = binary.resizeBinary(0.01);
        newImage.width.should.equal(1);
        newImage.height.should.equal(1);
        Array.from(newImage.data).should.eql([128]);
        newImage.position.should.eql([2, 2]);
    });
    
});
