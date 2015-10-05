import ROIMap from './ROIMap';

export default function createROIMapFromExtrema(
    image,
    {
        allowCorner = true,
        invert = false} = {}
    ) {

    image.checkProcessable('createROIMapFromExtrema',{components:[1]});

    // split will always return an array of images
    let positiveID = 0;
    let negativeID = 0;

    let MIN_VALUE = -32768;

    let pixels = new Int16Array(image.size); // maxValue: 32767, minValue: -32768
    let processed = new Int8Array(image.size);
    let variations = new Float32Array(image.size);


    let MAX_ARRAY = 0x00ffff; // should be enough for most of the cases
    let xToProcess = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
    let yToProcess = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!

    let from = 0;
    let to = 0;

    appendExtrema(image, {maxima:!invert});




    return new ROIMap(image, pixels, negativeID, positiveID);

    // we will look for the maxima (or minima) that is present in the picture
    // a maxima is a point that is surrounded by lower values
    // should deal with allowCorner and invert
    function appendExtrema({maxima = true}) {
        for (let y = image.borderSizes[1] + 1; y < image.height - 1 - image.borderSizes[1]; y++) {
            for (let x = 1 + image.borderSizes[0]; x < image.width - 1 - image.borderSizes[0]; x++) {
                let index = x + y * image.width;
                if (processed[index] === 0) {
                    let currentValue = (maxima) ? image.data[index] : -image.data[x + y * image.width];
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

                    pixels[index] = (maxima) ? ++positiveID : --negativeID;
                    xToProcess[to & MAX_ARRAY] = x;
                    yToProcess[to & MAX_ARRAY] = y;
                    to++;

                    while (from < to) {
                        let currentX = xToProcess[from & MAX_ARRAY];
                        let currentY = yToProcess[from & MAX_ARRAY];
                        process(currentX, currentY);
                        from++;
                    }
                }


            }
        }
    }

    /*
    For a specific point we will check the points around, increase the area of interests and add
    them to the processing list
     */
    function process(xCenter,yCenter) {
        let currentID = pixels[yCenter * image.width + xCenter];
        let currentValue = image.data[yCenter * image.width + xCenter];
        let currentVariation = variations[yCenter * image.width + xCenter];
        for (let y = yCenter - 1; y <= yCenter + 1; y++) {
            for (let x = xCenter - 1; x <= xCenter + 1; x++) {
                let index = y * image.width + x;
                if (processed[index] === 0) {
                    processed[index] = 1;
                    // we store the variation compare to the parent pixel
                    variations[index] = image.data[index] - currentValue;
                    if (variations[index] <= currentVariation) { // we look for maxima
                        pixels[index] = currentID;
                        xToProcess[to & MAX_ARRAY] = x;
                        yToProcess[to & MAX_ARRAY] = y;
                        to++;
                    }
                }
            }
        }
    }
}

