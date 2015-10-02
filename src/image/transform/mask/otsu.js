/**
 * The method is present in: Otsu, N (1979), "A threshold selection method from gray-level histograms", IEEE Trans. Sys., Man., Cyber. 9: 62-66
 * The Otsu implementation is based on: https://en.wikipedia.org/wiki/Otsu's_method
 * @param histogram - the histogram of the image
 * @returns {number} - the threshold
 */

export default function otsu(histogram){

    let sum = 0;            //Total Intensities of the histogram
    let total=0;            //Total pixels in the image
    let sumB = 0;           //Total intensities in the 1-class histogram
    let wB = 0;             //Total pixels in the 1-class histogram
    let wF = 0;             //Total pixels in the 2-class histogram
    let mB;                 //Mean of 1-class intensities
    let mF;                 //Mean of 2-class intensities
    let max = 0.0;          //Auxiliary variable to save temporarily the max variance
    let between = 0.0;      //To save the current variance
    let threshold = 0.0;


    for (let i = 1; i < histogram.length; ++i){
        sum += i * histogram[i];
        total+=histogram[i];
    }

    for (let i = 1; i <  histogram.length; ++i) {
        wB += histogram[i];

        if (wB == 0)
            continue;
        wF = total - wB;
        if (wF == 0)
            break;

        sumB += i * histogram[i];
        mB = sumB / wB;
        mF = (sum - sumB) / wF;
        between = wB * wF * (mB - mF) * (mB - mF);

        if ( between >= max ) {
            threshold = i;
            max = between;
        }
    }
    return threshold;
}

