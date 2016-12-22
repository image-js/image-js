import {getSquare, get1BitSquare} from 'test/common';

describe('toDataURL and toBase64', function () {
    it('toDataURL', function () {
        const image = getSquare();
        const dataURL = image.toDataURL();
        dataURL.should.be.a.String();
        dataURL.should.startWith('data:image/png;base64,');
    });

    it('toDataURL (async jpeg)', function () {
        const image = getSquare();
        const dataURL = image.toDataURL('jpeg', true);
        return Promise.all([
            dataURL.should.eventually.be.a.String(),
            dataURL.should.eventually.startWith('data:image/jpeg;base64,')
        ]);
    });

    it('toBase64', function () {
        const image = getSquare();
        const dataURL = image.toDataURL();
        const base64 = image.toBase64();
        base64.should.be.a.String();
        base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
    });

    it('toBase64 (async jpeg)', function () {
        const image = getSquare();
        return Promise.all([
            image.toBase64('jpeg', true),
            image.toDataURL('jpeg', true)
        ]).then(function (result) {
            const base64 = result[0];
            const dataURL = result[1];
            base64.should.be.a.String();
            base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
        });
    });

    it('toBase64 (sync bmp)', function () {
        const image = get1BitSquare();
        const base64 = image.toBase64('bmp', false);
        const dataURL = image.toDataURL('bmp', false);
        dataURL.should.be.a.String();
        base64.should.be.a.String();
        dataURL.should.startWith('data:image/bmp;base64,');
        base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
    });

    it('toBase64 (async bmp', function () {
        const image = get1BitSquare();
        const base64 = image.toBase64('bmp', true);
        const dataURL = image.toDataURL('bmp', true);
        return Promise.all([base64, dataURL], (base64, dataURL) => {
            dataURL.should.be.a.String();
            base64.should.be.a.String();
            dataURL.should.startWith('data:image/bmp;base64,');
            base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
        });
    });
});
