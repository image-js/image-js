import cv2
import numpy as np

img = cv2.imread('./test/img/test.png')


# kernel = np.zeros((3, 3))
# kernel[0, 0] = 0.09
# kernel[0, 1] = 0.09
# kernel[0, 2] = 0.09
# kernel[1, 0] = 0.09
# kernel[1, 1] = 0.09
# kernel[1, 2] = 0.09
# kernel[2, 0] = 0.09
# kernel[2, 1] = 0.09
# kernel[2, 2] = 0.09

kernelX = np.zeros((1, 3))
kernelX[0, 0] = 0.1
kernelX[0, 1] = 0.2
kernelX[0, 2] = 0.3

kernelY = np.zeros((1, 3))
kernelY[0, 0] = 0.4
kernelY[0, 1] = 0.5
kernelY[0, 2] = 0.6
# kernelY = np.zeros((1, 1))
# kernelY[0, 0] = 1


# img2 = cv2.clone(img)
dst = cv2.sepFilter2D(img, ddepth=cv2.CV_64F, kernelX=kernelX, kernelY=kernelY,
                      borderType=cv2.BORDER_REFLECT)

print(dst)

cv2.imwrite('./test/img/testConv.png', dst)
