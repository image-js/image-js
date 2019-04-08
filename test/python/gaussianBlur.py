import cv2

img = cv2.imread('./test/img/test.png')

kernel = cv2.getGaussianKernel(3, 1)

# grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# print(grey)
dst = cv2.sepFilter2D(img, -1, kernel, kernel,
                      borderType=cv2.BORDER_REFLECT)
# dst = cv2.GaussianBlur(grey, ksize=(3, 3), sigmaX=1, sigmaY=1,
#    borderType=cv2.BORDER_REFLECT)

# print(dst)
cv2.imwrite('./test/img/testGaussianBlur.png', dst)
