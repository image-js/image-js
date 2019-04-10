import cv2
import numpy as np

img = cv2.imread('./test/img/test.png')

M = np.zeros((2, 3))
M[0, 0] = 1
M[1, 1] = 1
M[0, 2] = 2
M[1, 2] = 4

dir(img)


dst = cv2.warpAffine(img, M, (16, 20), flags=cv2.INTER_NEAREST,
                     borderMode=cv2.BORDER_CONSTANT, borderValue=(
                         0, 0, 0))


cv2.imwrite('./test/img/testTranslation.png', dst)
