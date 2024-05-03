import numpy as np
import cv2 as cv
from os import path

dirname = path.dirname(path.abspath(__file__))

def writeImg(name, img):
    cv.imwrite(path.join(dirname, name), img)

img = cv.imread(path.join(dirname, 'test.png'))
assert img is not None, "file could not be read, check with os.path.exists()"
rows, cols = img.shape[0], img.shape[1]

# Image scaling by 10.
scale = 4
M = np.float32([[scale, 0, 0], [0, scale, 0]])
dst = cv.warpAffine(img, M, dsize=(cols * scale, rows * scale), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT,
                    borderValue=0)
writeImg('testScale.png', dst)

# Image resizing.
dst = cv.resize(img, (80, 100), interpolation=cv.INTER_NEAREST)
writeImg('testResizeNearest.png', dst)
dst = cv.resize(img, (80, 100), interpolation=cv.INTER_LINEAR)
writeImg('testResizeBilinear.png', dst)

# Image rotate counter-clockwise by 90 degrees
M = np.float32([[0, 1, 0], [-1, 0, cols - 1]])
dst = cv.warpAffine(img, M, (rows, cols), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT)
writeImg('testAntiClockwiseRot90.png', dst)

# Image rotate clockwise by 90 degrees
M = np.float32([[0, -1, cols + 1], [1, 0, 0]])
dst = cv.warpAffine(img, M, (rows, cols), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT)
writeImg('testClockwiseRot90.png', dst)

# Image interpolation
matrix = cv.getRotationMatrix2D((2, 4), angle=30, scale=0.8)
dst = cv.warpAffine(img, matrix, dsize=(cols, rows), flags=cv.INTER_NEAREST, borderMode=cv.BORDER_REFLECT)
writeImg('testInterpolate.png', dst)

# Image bilinear interpolation
matrix = cv.getRotationMatrix2D((2, 4), angle=30, scale=1.4)
dst = cv.warpAffine(img, matrix, dsize=(cols, rows), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_REFLECT)
writeImg('testRotateBilinear.png', dst)

# Image bicubic interpolation
matrix = cv.getRotationMatrix2D((2, 4), angle=30, scale=1.4)
dst = cv.warpAffine(img, matrix, dsize=(cols, rows), flags=cv.INTER_CUBIC, borderMode=cv.BORDER_REFLECT)
writeImg('testRotateBicubic.png', dst)

# Image reflection
M = np.float32([[1, 0, 0], [0, -1, rows - 1]])
dst = cv.warpAffine(img, M, (cols, rows), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT)
writeImg('testReflect.png', dst)

# Image translation
M = np.float32([[1, 0, 2], [0, 1, 4]])
dst = cv.warpAffine(img, M, (16, 20))
writeImg('testTranslate.png', dst)

# Image affine transformation
M = np.float32([[2, 1, 2], [-1, 1, 2]])
dst = cv.warpAffine(img, M, (cols, rows), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT)
writeImg('testAffineTransform.png', dst)

# Image blur
dst = cv.blur(img, (3, 5), borderType=cv.BORDER_REFLECT)
writeImg('testBlur.png', dst)

# Image gaussian blur
kernel = cv.getGaussianKernel(3, 1)
dst = cv.sepFilter2D(img, -1, kernel, kernel, borderType=cv.BORDER_REFLECT)
writeImg('testGaussianBlur.png', dst)

# Image convolution
kernelX = np.float32([[0.1, 0.2, 0.3]])
kernelY = np.float32([[0.4, 0.5, 0.6, -0.3, -0.4]])
dst = cv.sepFilter2D(img, ddepth=-1, kernelX=kernelX, kernelY=kernelY, borderType=cv.BORDER_REFLECT)
writeImg('testConvolution.png', dst)
