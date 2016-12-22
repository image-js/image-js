import {Image, load, refreshTmpDir, tmpDir, getSquare, get1BitSquare} from 'test/common';
import canvas from 'canvas';

describe('save to disk', function () {

    beforeEach(refreshTmpDir);
    afterEach(refreshTmpDir);

    it('load then save', function () {
        return load('format/rgb24.png').then(function (img) {
            let dataURL = img.toDataURL();
            return img.save(tmpDir + '/img1.png').then(function () {
                // reload the new file to check that the image is identical
                return Image.load(tmpDir + '/img1.png').then(function (img) {
                    img.toDataURL().should.equal(dataURL);
                });
            });
        });
    });

    // JPEG support is not always present
    const _it = canvas.jpegVersion ? it : it.skip;
    _it('load then save (jpg)', function () {
        return load('format/rgba32.png').then(function (img) {
            return img.save(tmpDir + '/img1.jpg', {format: 'jpeg'});
        });
    });

    it('new then save', function () {
        let img = getSquare();
        return img.save(tmpDir + '/img2.png');
    });

    it('new then save bmp', function () {
        let img = get1BitSquare();
        return img.save(tmpDir + '/square.bmp', {format: 'bmp'});
    });

});
