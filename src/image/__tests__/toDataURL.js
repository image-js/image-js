import {getSquare, get1BitSquare} from 'test/common';
import 'should';

describe('toDataURL and toBase64', () => {
    it('toDataURL', () => {
        const image = getSquare();
        const dataURL = image.toDataURL();
        dataURL.should.be.a.String();
        dataURL.should.startWith('data:image/png;base64,');
    });

    it('toDataURL (async jpeg)', async () => {
        const image = getSquare();
        const dataURL = await image.toDataURL('jpeg', {async: true});
        dataURL.should.be.a.String();
        dataURL.should.startWith('data:image/jpeg;base64,');
    });

    it('toBase64', () => {
        const image = getSquare();
        const dataURL = image.toDataURL();
        const base64 = image.toBase64();
        base64.should.be.a.String();
        base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
    });

    it('toBase64 (async jpeg)', () => {
        const image = getSquare();
        return Promise.all([
            image.toBase64('jpeg', {async: true}),
            image.toDataURL('jpeg', {async: true})
        ]).then(function (result) {
            const base64 = result[0];
            const dataURL = result[1];
            base64.should.be.a.String();
            base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
        });
    });

    it('toBase64 (sync bmp)', () => {
        const image = get1BitSquare();
        const base64 = image.toBase64('bmp');
        const dataURL = image.toDataURL('bmp');
        dataURL.should.be.a.String();
        base64.should.be.a.String();
        dataURL.should.startWith('data:image/bmp;base64,');
        base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
    });

    it('toBase64 (async bmp', () => {
        const image = get1BitSquare();
        const base64 = image.toBase64('bmp', {async: true});
        const dataURL = image.toDataURL('bmp', {async: true});
        return Promise.all([base64, dataURL], (base64, dataURL) => {
            dataURL.should.be.a.String();
            base64.should.be.a.String();
            dataURL.should.startWith('data:image/bmp;base64,');
            base64.should.equal(dataURL.substring(dataURL.indexOf(',') + 1));
        });
    });
});
