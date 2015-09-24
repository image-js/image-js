export default function histograms(images, options) {

    // TODO check all the images are the same kind

    if (images.length===0) return;

    let histograms=images[0].getHistograms(options);
    let histogramLength=histograms[0].length;
    for (let i=1; i<images.length; i++) {
        let secondHistograms=images[i].getHistograms(options);
        for (let c=0; c<histograms.length; i++) {
            for (let j=0; j<histogramLength; j++) {
                histograms[c][j]+=secondHistograms[c][j];
            }
        }
    }
    return histograms;
}
