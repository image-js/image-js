import cv2

img = cv2.imread('img.png', cv2.IMREAD_GRAYSCALE)

print(img)

factor = 4
dst = cv2.resize(img, (img.shape[1] * factor, img.shape[0] * factor), interpolation=cv2.INTER_LINEAR)

print(dst)
