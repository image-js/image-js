import cv2
import numpy as np

img = cv2.imread('./test/img/test.png')


kernelX = np.zeros((1, 3))
kernelX[0, 0] = 0.1
kernelX[0, 1] = 0.2
kernelX[0, 2] = 0.3

kernelY = np.zeros((1, 5))
kernelY[0, 0] = 0.4
kernelY[0, 1] = 0.5
kernelY[0, 2] = 0.6
kernelY[0, 3] = -0.3
kernelY[0, 4] = -0.4


dst = cv2.sepFilter2D(img, kernelX=kernelX, kernelY=kernelY,
                      borderType=cv2.BORDER_REFLECT)

cv2.imwrite('./test/img/testConv.png', dst)
