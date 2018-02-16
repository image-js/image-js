// Type definitions for image-js 0.18
// Project: https://github.com/image-js/image-js
// Definitions by: Michaël Zasso <https://github.com/targos>

// Global variable exposed by UMD bundle
export as namespace IJS;

declare class Image {
    width: number;
    height: number;
    data: DataArray;
    size: number;
    components: number;
    alpha: BinaryValue;
    bitDepth: BitDepth;
    maxValue: number;
    colorModel: ColorModel;
    channels: number;
    meta: object;
    
    constructor(width: number, height: number, data: ArrayLike<number>, options?: ImageConstructorOptions);
    constructor(width: number, height: number, options?: ImageConstructorOptions);
    constructor(options?: ImageConstructorOptions)

    static isImage(object: any): boolean;
    static fromCanvas(canvas: HTMLCanvasElement): Image;
    static createFrom(other: Image, options: ImageConstructorOptions);
    static load(image: (string|ArrayBuffer|Uint8Array), options?: RequestInit)

    getRoiManager(): RoiManager;
    clone(): Image;
    
    // valueMethods
    getValueXY(x: number, y: number, channel: number): number;
    setValueXY(x: number, y: number, channel: number, value: number): this;
    getValue(index: number, channel: number): number;
    setValue(index: number, channel: number, value: number): this;
    getPixelXY(x: number, y: number): Array<number>;
    setPixelXY(x: number, y: number, value: Array<number>): this;
    getPixel(index: number): Array<number>;
    setPixel(index: number, value: Array<number>): this;

    // bitMethods
    getBit(index: number): BinaryValue;
    setBit(index: number): void;
    clearBit(index: number): void;
    toggleBit(index: number): void;
    getBitXY(x: number, y: number): BinaryValue;
    setBitXY(x: number, y: number): void;
    clearBitXY(x: number, y: number): void;
    toggleBitXY(x: number, y: number): void;

    // exportMethods
    save(path: string, options?: SaveOptions): Promise<void>;
    toDataURL(type?: string, options?: SaveOptions): string;
    toBase64(type?: string, options?: SaveOptions): string;
    toBlob(type?: string, quality?: number): Blob;
    getCanvas(): HTMLCanvasElement;

    checkProcessable(processName: string, options: object): void;
    getRGBAData(options?: {clamped?: boolean}): (Uint8Array|Uint8ClampedArray);

    // extend
    invert(options?: OutOrInplace): Image;
    abs(options?: OutOrInplace): Image;
    level(options?: LevelOptions): this;
    // add
    // subtract
    // subtractImage
    // multiply
    // divide
    // hypotenuse
    // background
    // flipX
    // flipY

    // blurFilter
    // medianFilter
    // gaussianFilter
    // sobelFilter
    // gradientFilter
    // scharrFilter

    dilate(options?: MorphologicalOptions): Image;
    erode(options?: MorphologicalOptions): Image;
    open(options?: MorphologicalOptions): Image;
    close(options?: MorphologicalOptions): Image;
    topHat(options?: MorphologicalOptions): Image;
    blackHat(options?: MorphologicalOptions): Image;
    morphologicalGradient(options?: MorphologicalOptions): Image;

    // warpingFourPoints
    // crop
    // cropAlpha
    // scale
    // hsv
    // hsl
    // cmyk
    // rgba8
    // grey
    // mask
    // pad
    // colorDepth
    // setBorder
    // rotate
    // rotateLeft
    // rotateRight

    // getRow
    // getColumn
    // getMatrix
    // setMatrix
    // getPixelsArray
    // getIntersection
    // getClosestCommonParent
    // getThreshold

    // split
    // getChannel
    // combineChannels
    // setChannel
    // getSimilarity
    // getPixelsGrid
    // getBestMatch

    // cannyEdge
    // convolution
    // convolutionFft
    // extract
    // floodFill
    // paintLabels
    // paintMasks
    // paintPoints
    // paintPolyline
    // paintPolylines
    // paintPolygon
    // paintPolygons

    // countAlphaPixels
    // monotoneChainConvexHull
    // minimalBoundingRectangle
    // getHistogram
    // getHistograms
    // getColorHistogram
    // getMin
    // getMax
    // getSum
    // getMoment
    // getLocalMaxima
    // getMedian
    // getMean
    // getPoints
    // getRelativePosition
    // getSvd
}

declare class RoiManager {}

interface ImageConstructorOptions {
    width?: number,
    height?: number,
    data?: ArrayLike<number>,
    kind?: ImageKind,
    bitDepth?: BitDepth,
    components?: number,
    alpha?: (0|1),
    colorModel?: ColorModel
}

interface SaveOptions {
    format?: string,
    useCanvas?: boolean,
    encoder?: object
}

interface OutOrInplace {
    inPlace?: boolean,
    out?: Image
}

interface LevelOptions {
    channels?: SelectedChannels,
    min?: number,
    max?: number
}

interface MorphologicalOptions {
    kernel?: BinaryKernel,
    iterations?: number
}

declare enum ImageKind {
    BINARY = 'BINARY',
    GREY = 'GREY',
    GREYA = 'GREYA',
    RGB = 'RGB',
    RGBA = 'RGBA',
    CMYK = 'CMYK',
    CMYKA = 'CMYKA',
}

declare enum BitDepth {
    BINARY = 1,
    UINT8 = 8,
    UINT16 = 16,
    FLOAT32 = 32
}

declare enum ColorModel {
    GREY = 'GREY',
    RGB = 'RGB',
    HSL = 'HSL',
    HSV = 'HSV',
    CMYK = 'CMYK'
}

type DataArray = Uint8Array | Uint16Array | Float32Array;
type BinaryValue = 0 | 1;
type SelectedChannels = number | string | Array<number> | Array<string>;
type BinaryKernel = Array<Array<BinaryValue>>;
type Kernel = Array<Array<number>>;

export { Image }
export default Image;
