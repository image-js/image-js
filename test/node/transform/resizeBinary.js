import {Image, load} from '../common';

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
        let binary = new Image(4,4,[204, 51], {
            kind: 'BINARY'
        });
        let newImage = binary.resizeBinary(0.5);
        newImage.width.should.equal(2);
        newImage.height.should.equal(2);
        Array.from(newImage.data).should.eql([144]);
        newImage.position.should.eql([1,1]);
    });
});
