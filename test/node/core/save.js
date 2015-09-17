import {Image, load, getHash, refreshTmpDir, tmpDir, getSquare} from '../common';

describe('save to disk', function () {

    beforeEach(refreshTmpDir);
    afterEach(refreshTmpDir);

    it('load then save', function () {
        return load('format/rgba32.png').then(function (img) {
            let sha = getHash(img);
            return img.save(tmpDir + '/img1.png').then(function () {
                // reload the new file to check that the image is identical
                return Image.load(tmpDir + '/img1.png').then(function (img) {
                    getHash(img).should.equal(sha);
                });
            });
        });
    });

    it.skip('load then save (jpg)', function () {
        return load('format/rgba32.png').then(function (img) {
            return img.save(tmpDir + '/img1.jpg', {format: 'jpeg'});
        });
    });

    it.skip('new then save', function () {
        let img = getSquare();
        return img.save(tmpDir + '/img2.png');
    });

});
