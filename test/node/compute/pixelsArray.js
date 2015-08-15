import {Image} from '../common';

describe('calculate the pixels array', function () {
    it('check the array', function () {

        let img=new Image(8,2,[255,0],{
            kind: 'BINARY'
        });

        let pixelsArray=img.getPixelsArray();
        pixelsArray.should.eql([ [ 0, 0 ],  [ 1, 0 ],  [ 2, 0 ],  [ 3, 0 ],  [ 4, 0 ],  [ 5, 0 ],  [ 6, 0 ],  [ 7, 0 ] ]);
    });
});

