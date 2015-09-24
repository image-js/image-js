export default function histogram(images, options) {

    // TODO check all the images are the same kind

    if (images.length===0) return;

    let histogram=images[0].getHistogram(options);
    for (let i=1; i<images.length; i++) {
        let secondHistogram=images[i].getHistogram(options);
        for (let j=0; j<histogram.length; j++) {
            histogram[j]+=secondHistogram[j];
        }
    }
    return histogram;
}
