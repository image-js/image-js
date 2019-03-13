// Type definitions for image-js
// Project: https://github.com/image-js/image-js
// Definitions by: Michaël Zasso <https://github.com/targos>

// Global variable exposed by UMD bundle
export as namespace IJS;

export declare class Image {
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
    level(options?: {channels?: SelectedChannels, min?: number, max?: number}): this;
    // add
    // subtract
    // subtractImage
    // multiply
    // divide
    // hypotenuse
    // background
    // flipX
    // flipY

    blurFilter(options?: {radius?: number}): Image;
    medianFilter(options?: {radius?: number, border?: BorderHandling, channels?: SelectedChannels}): Image;
    gaussianFilter(options?: GaussianFilterOptions): Image;
    gradientFilter(options?: GradientFilterOptions): Image;
    sobelFilter(options?: GradientOptions): Image;
    scharrFilter(options?: GradientOptions): Image;

    dilate(options?: MorphologicalOptions): Image;
    erode(options?: MorphologicalOptions): Image;
    open(options?: MorphologicalOptions): Image;
    close(options?: MorphologicalOptions): Image;
    topHat(options?: MorphologicalOptions): Image;
    blackHat(options?: MorphologicalOptions): Image;
    morphologicalGradient(options?: MorphologicalOptions): Image;

    // warpingFourPoints
    crop(options?: CropOptions): Image;
    // cropAlpha
    resize(options?: ResizeOptions): Image;
    // hsv
    // hsl
    // cmyk
    // rgba8
    grey(options?: GreyOptions): Image;
    mask(options?: MaskOptions): Image;
    // pad
    // colorDepth
    // setBorder
    rotate(angle: number, options?: RotateOptions): Image;
    rotateLeft(): Image;
    rotateRight(): Image;

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
    convolution(kernel: Kernel, options?: ConvolutionOptions): Image;
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
}

export declare class RoiManager {}

export interface ImageConstructorOptions {
    width?: number,
    height?: number,
    data?: ArrayLike<number>,
    kind?: ImageKind,
    bitDepth?: BitDepth,
    components?: number,
    alpha?: (0|1),
    colorModel?: ColorModel
}

export interface SaveOptions {
    format?: string,
    useCanvas?: boolean,
    encoder?: object
}

export interface OutOrInplace {
    inPlace?: boolean,
    out?: Image
}

export interface MorphologicalOptions {
    kernel?: BinaryKernel,
    iterations?: number
}

export interface GaussianFilterOptions {
    radius?: number,
    sigma?: number,
    channels?: SelectedChannels,
    border?: BorderHandling,
    algorithm?: ConvolutionAlgorithm
}

export interface ConvolutionOptions {
    channels?: SelectedChannels,
    bitDepth?: BitDepth,
    normalize?: boolean,
    divisor?: number,
    border?: BorderHandling,
    algorithm?: ConvolutionAlgorithm
}

export interface GradientOptions {
    direction?: GradientDirection,
    border?: BorderHandling,
    channels?: SelectedChannels,
    bitDepth?: BitDepth
}

export interface GradientFilterOptions extends GradientOptions {
    kernelX?: Kernel,
    kernelY?: Kernel
}

export declare enum ImageKind {
    BINARY = 'BINARY',
    GREY = 'GREY',
    GREYA = 'GREYA',
    RGB = 'RGB',
    RGBA = 'RGBA',
    CMYK = 'CMYK',
    CMYKA = 'CMYKA',
}

export declare enum BitDepth {
    BINARY = 1,
    UINT8 = 8,
    UINT16 = 16,
    FLOAT32 = 32
}

export declare enum ColorModel {
    GREY = 'GREY',
    RGB = 'RGB',
    HSL = 'HSL',
    HSV = 'HSV',
    CMYK = 'CMYK'
}

export declare enum BorderHandling {
    COPY = 'copy'
}

export declare enum ConvolutionAlgorithm {
    AUTO = 'auto',
    DIRECT = 'direct',
    FFT = 'fft',
    SEPARABLE = 'separable'
}

export interface CropOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export interface ResizeOptions {
    width?: number;
    height?: number;
    factor?: number;
    interpolation?: InterpolationAlgorithm;
    preserveAspectRatio?: boolean;
}

export interface GreyOptions {
    algorithm?: GreyAlgorithm|GreyAlgorithmCallback;
    keepAlpha?: boolean;
    mergeAlpha?: boolean;
    out?: Image;
}

export declare enum GreyAlgorithm {
    LUMA709 = 'luma709',
    LUMA601 = 'luma601',
    MAXIMUM = 'maximum',
    MINIMUM = 'minimum',
    AVERAGE = 'average',
    MINMAX = 'minmax',
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue',
    CYAN = 'cyan',
    MAGENTA = 'magenta',
    YELLOW = 'yellow',
    BLACK = 'black',
    HUE ='hue',
    SATURATION = 'saturation',
    LIGHTNESS = 'lightness'
}

export type GreyAlgorithmCallback = (red: number, green: number, blue: number) => number;

export interface MaskOptions {
    algorithm?: ThresholdAlgorithm|'threshold';
    threshold?: number;
    useAlpha?: boolean;
    invert?: boolean;
}

export declare enum ThresholdAlgorithm {
    HUANG = 'huang',
    INTERMODES = 'intermodes',
    ISODATA = 'isodata',
    LI = 'li',
    MAX_ENTROPY = 'maxentropy',
    MEAN = 'mean',
    MIN_ERROR = 'minerror',
    MOMENTS = 'moments',
    OTSU = 'otsu',
    PERCENTILE = 'percentile',
    RENYI_ENTROPY = 'renyientropy',
    SHANBHAG = 'shanbhag',
    TRIANGLE = 'triangle',
    YEN = 'yen'
}

export interface RotateOptions {
    interpolation?: InterpolationAlgorithm
}

export declare enum GradientDirection {
    WIDTH = 'x',
    HEIGHT = 'y',
    BOTH = 'xy'
}

export declare enum InterpolationAlgorithm {
    NEAREST_NEIGHBOR = 'nearestNeighbor',
    BILINEAR = 'bilinear'
}

export type DataArray = Uint8Array | Uint16Array | Float32Array;
export type BinaryValue = 0 | 1;
export type SelectedChannels = number | string | Array<number> | Array<string>;
export type BinaryKernel = Array<Array<BinaryValue>>;
export type Kernel = Array<Array<number>>;

export default Image;
