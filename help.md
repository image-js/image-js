Try to create a coherent API that will distinguish:
* properties
* in place functions
* 
* static functions

### Properties
* min, max, average, sum, medianFilter
* histogram, colorHistogram

### Properties with options
* 

### In place function
In place functions could have just a name without anything in front
* invert()
* rgb() - could be possible if the number of channel is corret
* add(), subtract(), multiply(), divide()

### Functions that return a new Image
There would always be a small prefix in the name of the function
* toRgb()
* toDataURL()
* applyMedian() ... not convinced by apply
* applyGaussian()
* toGrey()
* getInvert()
* add(), substract(), multiply(), medianFilter ... what to put in front ???

### Static functions
When the function combines many pictures should we use systematically a static approach ?
* img1.average(img2) or Image.average(img1, img2) ?
* img1.getSimilarity(img2) or Image.getSimilarity(img1, img2) ?
