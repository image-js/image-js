export default function createROIMapFromExtrema(
    image,
    {
        allowCorner = false,
        invert = false} = {}
    ) {

    image.checkProcessable('createROIMapFromExtrema',{components:[1]});

    // split will always return an array of images
    let positiveID = 0;
    let negativeID = 0;

    let MIN_VALUE = -32768;

    let pixels = new Int16Array(image.size); // maxValue: 32767, minValue: -32768
    let variations = new Float32Array(image.size);


    let MAX_ARRAY = 0x00ffff; // should be enough for most of the cases
    let xToProcess = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
    let yToProcess = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!

    let from=0;
    let to=0;

    appendExtrema(image, {maxima:!invert});

    while (from < to) {
        let currentX = xToProcess[from & MAX_ARRAY];
        let currentY = yToProcess[from & MAX_ARRAY];
        process(currentX, currentY);
        from++;
    }
    console.log(pixels);
    console.log(variations);

    // we will look for the maxima (or minima) that is present in the picture
    // a maxima is a point that is surrounded by lower values
    // should deal with allowCorner and invert
    function appendExtrema({maxima = true}) {
        for (let y = 1; y < image.height - 1; y++) {
            for (let x = 1; x < image.width - 1; x++) {
                let currentValue = (maxima) ? image.data[x + y * image.width] : -image.data[x + y * image.width];
                if (image.data[y * image.width + x - 1] > currentValue) { // LEFT
                    continue;
                }
                if (image.data[y * image.width + x + 1] > currentValue) { // RIGHT
                    continue;
                }
                if (image.data[(y - 1) * image.width + x] > currentValue) { // TOP
                    continue;
                }
                if (image.data[(y + 1) * image.width + x] > currentValue) { // BOTTOM
                    continue;
                }
                if (allowCorner) {
                    if (image.data[(y - 1) * image.width + x - 1] > currentValue) { // LEFT TOP
                        continue;
                    }
                    if (image.data[(y - 1) * image.width + x + 1] > currentValue) { // RIGHT TOP
                        continue;
                    }
                    if (image.data[(y + 1) * image.width + x - 1] > currentValue) { // LEFT BOTTOM
                        continue;
                    }
                    if (image.data[(y + 1) * image.width + x + 1] > currentValue) { // RIGHT BOTTOM
                        continue;
                    }
                }
                pixels[y * image.width + x] = (maxima) ? ++positiveID : --negativeID;
                xToProcess[to & MAX_ARRAY]=x;
                yToProcess[to & MAX_ARRAY]=y;
                to++;
            }
        }
    }

    /*
    For a specific point we will check the points around, increase the area of interests and add
    them to the processing list
     */
    function process(xCenter,yCenter) {
        let currentID=pixels[yCenter*image.width+xCenter];
        let currentValue=image.data[yCenter*image.width+xCenter];
        let currentVariation=variations[yCenter*image.width+xCenter];
        for (let y = yCenter - 1; y < yCenter + 1; y++) {
            for (let x = xCenter - 1; x < xCenter + 1; x++) {
                if ((! (x===xCenter) && (y===yCenter))) {
                    let index=y*image.width+x;
                    if (pixels[index]===0) {
                        pixels[index] = currentID;
                        // we store the variation compare to the parent pixel
                        variations[index] = image.data[index] - currentValue;
                        if (variations[index] < currentVariation) {
                        }
                        // should we add points that are around ???? We will check the derivative of all the points that where
                        // not yet treated
                        for (let j = Math.max(y - 1, 0); j < Math.min(image.height, y + 1); j++) {
                            for (let i = Math.max(x - 1, 0); i < Math.min(image.width, x + 1); i++) {
                                let subindex = j * image.width + i;
                                if (pixels[subindex] === 0) {
                                    xToProcess[to & MAX_ARRAY] = j;
                                    yToProcess[to & MAX_ARRAY] = i;
                                    to++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /*

    for (let x = 0; x < mask.width; x++) {
        for (let y = 0; y < mask.height; y++) {
            if (pixels[y * mask.width + x] === 0) {
                // need to process the whole surface
                analyseSurface(x, y);
            }
        }
    }

    function analyseSurface(x, y) {
        let from = 0;
        let to = 0;
        let targetState = mask.getBitXY(x, y);
        let id = targetState ? ++positiveID : --negativeID;
        xToProcess[0] = x;
        yToProcess[0] = y;
        while (from <= to) {
            let currentX = xToProcess[from & MAX_ARRAY];
            let currentY = yToProcess[from & MAX_ARRAY];
            pixels[currentY * mask.width + currentX] = id;
            // need to check all around mask pixel
            if (currentX > 0 && pixels[currentY * mask.width + currentX - 1] === 0 &&
                mask.getBitXY(currentX - 1, currentY) === targetState) {
                // LEFT
                to++;
                xToProcess[to & MAX_ARRAY] = currentX - 1;
                yToProcess[to & MAX_ARRAY] = currentY;
                pixels[currentY * mask.width + currentX - 1] = -32768;
            }
            if (currentY > 0 && pixels[(currentY - 1) * mask.width + currentX] === 0 &&
                mask.getBitXY(currentX, currentY - 1) === targetState) {
                // TOP
                to++;
                xToProcess[to & MAX_ARRAY] = currentX;
                yToProcess[to & MAX_ARRAY] = currentY - 1;
                pixels[(currentY - 1) * mask.width + currentX] = -32768;
            }
            if (currentX < mask.width - 1 && pixels[currentY * mask.width + currentX + 1] === 0 &&
                mask.getBitXY(currentX + 1, currentY) === targetState) {
                // RIGHT
                to++;
                xToProcess[to & MAX_ARRAY] = currentX + 1;
                yToProcess[to & MAX_ARRAY] = currentY;
                pixels[currentY * mask.width + currentX + 1] = -32768;
            }
            if (currentY < mask.height - 1 && pixels[(currentY + 1) * mask.width + currentX] === 0 &&
                mask.getBitXY(currentX, currentY + 1) === targetState) {
                // BOTTOM
                to++;
                xToProcess[to & MAX_ARRAY] = currentX;
                yToProcess[to & MAX_ARRAY] = currentY + 1;
                pixels[(currentY + 1) * mask.width + currentX] = -32768;
            }
            if (allowCorner) {
                if (currentX > 0 && currentY > 0 && pixels[(currentY - 1) * mask.width + currentX - 1] === 0 &&
                    mask.getBitXY(currentX - 1, currentY - 1) === targetState) {
                    // TOP LEFT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX - 1;
                    yToProcess[to & MAX_ARRAY] = currentY - 1;
                    pixels[(currentY - 1) * mask.width + currentX - 1] = -32768;
                }
                if (currentX < mask.width - 1 && currentY > 0 && pixels[(currentY - 1) * mask.width + currentX + 1] === 0 &&
                    mask.getBitXY(currentX + 1, currentY - 1) === targetState) {
                    // TOP RIGHT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX + 1;
                    yToProcess[to & MAX_ARRAY] = currentY - 1;
                    pixels[(currentY - 1) * mask.width + currentX + 1] = -32768;
                }
                if (currentX > 0 && currentY < mask.height - 1 && pixels[(currentY + 1) * mask.width + currentX - 1] === 0 &&
                    mask.getBitXY(currentX - 1, currentY + 1) === targetState) {
                    // BOTTOM LEFT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX - 1;
                    yToProcess[to & MAX_ARRAY] = currentY + 1;
                    pixels[(currentY + 1) * mask.width + currentX - 1] = -32768;
                }
                if (currentX < mask.width - 1 && currentY < mask.height - 1 && pixels[(currentY + 1) * mask.width + currentX + 1] === 0 &&
                    mask.getBitXY(currentX + 1, currentY + 1) === targetState) {
                    // BOTTOM RIGHT
                    to++;
                    xToProcess[to & MAX_ARRAY] = currentX + 1;
                    yToProcess[to & MAX_ARRAY] = currentY + 1;
                    pixels[(currentY + 1) * mask.width + currentX + 1] = -32768;
                }
            }


            from++;

            if ((to - from) > MAX_ARRAY) {
                throw new Error('analyseMask can not finish, the array to manage internal data is not big enough.' +
                    'You could improve mask by changing MAX_ARRAY');
            }
        }
    }
    */

//    return new ROIMap(mask, pixels, negativeID, positiveID);

}
/*
class ROIMap {
    constructor(parent, pixels, negativeID, positiveID) {
        this.parent = parent;
        this.width = parent.width;
        this.height = parent.height;
        this.pixels = pixels; // pixels containing the annotations
        this.negative = -negativeID; // number of negative zones
        this.positive = positiveID; // number of positivie zones
        this.total = positiveID - negativeID; // total number of zones
    }
}
*/