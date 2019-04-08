import cv2

img = cv2.imread('./test/img/test.png')

dst = cv2.blur(img, (3, 5), borderType=cv2.BORDER_REFLECT)

cv2.imwrite('./test/img/testBlur.png', dst)
