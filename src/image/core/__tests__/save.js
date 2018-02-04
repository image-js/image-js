import { Image, load, refreshTmpDir, tmpDir, getSquare, get1BitSquare } from 'test/common';

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

  it('load then save (jpg)', async () => {
    const img = await load('format/rgba32.png');
    await img.save(`${tmpDir}/img1.jpg`, { format: 'jpeg' });
  });

  it('new then save', async () => {
    const img = getSquare();
    await img.save(`${tmpDir}/img2.png`);
  });

  it('new then save with unsupported bit depth', async () => {
    const img = new Image(2, 2, { kind: 'BINARY' });
    await expect(img.save(`${tmpDir}/imgBinary.png`)).rejects.toThrow(/The process: save \(PNG\) can only be applied if bit depth is in: 8,16/);
  });

  it('new then save bmp', async () => {
    const img = get1BitSquare();
    await img.save(`${tmpDir}/square.bmp`, { format: 'bmp' });
  });

});
