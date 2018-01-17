import { Image, load, refreshTmpDir, tmpDir, getSquare, get1BitSquare } from 'test/common';
import canvas from 'canvas';

describe('save to disk', () => {

    beforeEach(refreshTmpDir);
    afterEach(refreshTmpDir);

    it('load then save', async () => {
        const img = await load('format/rgb24.png');
        let dataURL = img.toDataURL();
        await img.save(`${tmpDir}/img1.png`);
        // reload the new file to check that the image is identical
        const otherImg = await Image.load(`${tmpDir}/img1.png`);
        expect(otherImg.toDataURL()).toBe(dataURL);
    });

    // JPEG support is not always present
    const _it = canvas.jpegVersion ? it : it.skip;
    _it('load then save (jpg)', async () => {
        const img = await load('format/rgba32.png');
        await img.save(`${tmpDir}/img1.jpg`, { format: 'jpeg' });
    });

    it('new then save', async () => {
        const img = getSquare();
        await img.save(`${tmpDir}/img2.png`);
    });

    it('new then save with canvas (unsupported bit depth)', async () => {
        const img = new Image(2, 2, { kind: 'BINARY' });
        await img.save(`${tmpDir}/imgBinary.png`);
    });

    it('new then save bmp', async () => {
        const img = get1BitSquare();
        await img.save(`${tmpDir}/square.bmp`, { format: 'bmp' });
    });

});
