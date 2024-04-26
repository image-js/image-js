import numpy as np
import cv2 as cv

img = cv.imread('./test.png')
assert img is not None, "file could not be read, check with os.path.exists()"
rows, cols = img.shape[0], img.shape[1]

# Image scaling by 10.
scale = 4
M = np.float32([[scale, 0, 0], [0, scale, 0]])
dst = cv.warpAffine(img, M, dsize=(cols * scale, rows * scale), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT,
                    borderValue=0)
cv.imwrite('testScale.png', dst)

# Image resizing by 10.
dst = cv.resize(img, (80, 100), interpolation=cv.INTER_LINEAR)
cv.imwrite('testResizeBilinear.png', dst)

# Image rotate counter-clockwise by 90 degrees
M = np.float32([[0, 1, 0], [-1, 0, cols - 1]])
dst = cv.warpAffine(img, M, (rows, cols), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT)
cv.imwrite('testAntiClockwiseRot90.png', dst)

# Image rotate clockwise by 90 degrees
M = np.float32([[0, -1, cols + 1], [1, 0, 0]])
dst = cv.warpAffine(img, M, (rows, cols), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT)
cv.imwrite('testClockwiseRot90.png', dst)

# Image interpolation
matrix = cv.getRotationMatrix2D((2, 4), angle=30, scale=0.8)
dst = cv.warpAffine(img, matrix, dsize=(cols, rows), flags=cv.INTER_NEAREST, borderMode=cv.BORDER_REFLECT)
cv.imwrite('testInterpolate.png', dst)

# Image bilinear interpolation
matrix = cv.getRotationMatrix2D((2, 4), angle=30, scale=1.4)
dst = cv.warpAffine(img, matrix, dsize=(cols, rows), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_REFLECT)
cv.imwrite('testRotateBilinear.png', dst)

# Image bicubic interpolation
matrix = cv.getRotationMatrix2D((2, 4), angle=30, scale=1.4)
dst = cv.warpAffine(img, matrix, dsize=(cols, rows), flags=cv.INTER_CUBIC, borderMode=cv.BORDER_REFLECT)
cv.imwrite('testRotateBicubic.png', dst)

# Image reflection
M = np.float32([[1, 0, 0], [0, -1, rows - 1]])
dst = cv.warpAffine(img, M, (cols, rows), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT)
cv.imwrite('testReflect.png', dst)

# Image translation
M = np.float32([[1, 0, 2], [0, 1, 4]])
dst = cv.warpAffine(img, M, (16, 20))
cv.imwrite('testTranslate.png', dst)

# Image affine transformation
M = np.float32([[2, 1, 2], [-1, 1, 2]])
dst = cv.warpAffine(img, M, (cols, rows), flags=cv.INTER_LINEAR, borderMode=cv.BORDER_CONSTANT)
cv.imwrite('testAffineTransform.png', dst)

# Image blur
dst = cv.blur(img, (3, 5), borderType=cv.BORDER_REFLECT)
cv.imwrite('testBlur.png', dst)

# Image gaussian blur
kernel = cv.getGaussianKernel(3, 1)
dst = cv.sepFilter2D(img, -1, kernel, kernel, borderType=cv.BORDER_REFLECT)
cv.imwrite('testGaussianBlur.png', dst)

# Image convolution
kernelX = np.float32([[0.1, 0.2, 0.3]])

kernelY = np.float32([[0.4, 0.5, 0.6, -0.3, -0.4]])

dst = cv.sepFilter2D(img, ddepth=-1, kernelX=kernelX, kernelY=kernelY, borderType=cv.BORDER_REFLECT)
cv.imwrite('testConvolution.png', dst)
