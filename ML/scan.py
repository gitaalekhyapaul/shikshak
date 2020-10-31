import cv2
import imutils
import numpy as np


def unit_test():
    path = "ML/Test5.jpg"
    cv2.namedWindow('test', cv2.WINDOW_NORMAL)
    cv2.namedWindow('Line_dect', cv2.WINDOW_NORMAL)

    image = cv2.imread(path)

    img_lines = image.copy()

    size = 500

    ratio = image.shape[0] / size
    rescaled_image = imutils.resize(image, height=int(size))
    img_lines = rescaled_image.copy()

    MORPH = 9
    CANNY = 84
    HOUGH = 25

    IM_HEIGHT, IM_WIDTH, _ = rescaled_image.shape

    # convert the image to grayscale and blur it slightly
    gray = cv2.cvtColor(rescaled_image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (7, 7), 0)

    # dilate helps to remove potential holes between edge segments
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (MORPH, MORPH))
    dilated = cv2.dilate(gray, kernel)

    # find edges and mark them in the output map using the Canny algorithm
    edged = cv2.Canny(dilated, 0, CANNY)

    lines = cv2.HoughLinesP(edged,1,np.pi/180, 100)
    points = cv2.cornerHarris(gray,20,15,0.22,)
    points = cv2.dilate(points,None)
    ret, points = cv2.threshold(points,0.01*points.max(),255,0)

    points = np.uint8(points)

    ret, labels, stats, centroids = cv2.connectedComponentsWithStats(points)
    
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.001)
    corners = cv2.cornerSubPix(gray,np.float32(centroids),(5,5),(-1,-1),criteria)

    res = np.hstack((centroids,corners))
    print(res)
    res = np.int0(res)

    print(res)

    print(res.shape)
    img_lines[res[:,3],res[:,2]] = [0,255,0]
    img_lines[res[:,1],res[:,0]] = [0,0,255]


    #print(lines)
    #print(len(lines))
    #img_lines[points>0.01*points.max()]=[0,0,255]

    # for line in lines:
    #     x1, y1, x2, y2 = line[0]
    #     cv2.line(img_lines, (x1, y1), (x2, y2), (128, 255, 128), 1)

    
    #cv2.imshow("Line_dect", img_lines)


    #cv2.imshow("test", gray)

    #orig = image.copy()

    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == "__main__":
    unit_test()
    print("Exiting")
