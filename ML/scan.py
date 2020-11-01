import cv2
import imutils
import numpy as np
import matplotlib.pyplot as plt


def avg(A):
    l = len(A)
    if l == 0:
        return -1
    i = 0
    j = 0
    for k in A:
        i += k[0]
        j += k[1]

    return [int(i/l), int(j/l)]


def Conditions(Points, height, width):
    """
    y -> [0]
    x -> [1]

    """

    m = height
    n = width

    A = []
    B = []
    C = []
    D = []
    DIV_n = 4
    DIM_m = 2
    for i in Points:
        if i[0] <= m/DIV_n:
            if i[1] <= n/DIV_n:
                A.append([i[0], i[1]])
            elif i[1] >= (DIV_n - 1)*n/DIV_n:
                B.append([i[0], i[1]])
            else:
                pass
        elif i[0] >= (DIM_m - 1)*m/DIM_m:
            if i[1] <= n/DIV_n:
                C.append([i[0], i[1]])
            elif i[1] >= (DIV_n - 1)*n/DIV_n:
                D.append([i[0], i[1]])
            else:
                pass
        else:
            pass

    if len(A) == 0:
        A = [[0, 0]]
    if len(B) == 0:
        B = [[0, height-1]]
    if len(C) == 0:
        C = [[width-1, 0]]
    if len(D) == 0:
        D = [[width-1, height-1]]

    A, B, C, D = list(map(lambda z: avg(z), [A, B, C, D]))

    return A, B, C, D


def Cor_point(rescaled_image):


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

    points = cv2.cornerHarris(dilated, 20, 15, 0.05,)

    ret, points = cv2.threshold(points, 0.01*points.max(), 255, 0)
    points = np.uint8(points)

    ret, labels, stats, centroids = cv2.connectedComponentsWithStats(points)

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.001)
    corners = cv2.cornerSubPix(
        gray,
        np.float32(centroids),
        (5, 5),
        (-1, -1),
        criteria
    )

    res = np.vstack((centroids, corners))
    res = np.int0(res)
    return res, IM_HEIGHT, IM_WIDTH


def findPoints(uid, path):
    try:
        size = 500

        image = cv2.imread(path)

        ratio = image.shape[0] / size

        rescaled_image = imutils.resize(image, height=int(size))

        res, h, w = Cor_point(rescaled_image)

        A, B, C, D = Conditions(res, h, w)

        A, B, C, D = list(
            map(lambda x: ((int(x[0]*ratio), int(x[1]*ratio))), [A, B, C, D]))

        cv2.line(image, A, B, (128, 255, 64), 5)
        cv2.line(image, D, C, (128, 255, 64), 5)
        cv2.line(image, C, A, (128, 255, 64), 5)
        cv2.line(image, D, B, (128, 255, 64), 5)


        if PROD:
            cv2.imwrite(path, image)
        else:
            cv2.namedWindow('new', cv2.WINDOW_NORMAL)
            cv2.imshow("new", image)
            cv2.waitKey(0)
        return True
    except:
        print("Error in find points")
        return False 
    
def convert(uid,path):
    A,B,C,D = db.getpoints(uid)

    contours = [np.array(
        [
            [A[0],A[1]],
            [B[0],B[1]],
            [D[0],D[1]],
            [C[0],C[1]]
        ],
         dtype = np.int32)]





PROD = False

if __name__ == "__main__":
    path = "ML/Test2.jpg"
    uid = "resderf"

    print("Starting")

    response = findPoints(uid, path)

    # res,h,w  = Cor_point(path)
    # print(res)

    # A,B,C,D = Conditions(res,h,w)

    # image = cv2.imread(path)
    # rescale = imutils.resize(image, height=int(500))

    # # rescale[np.array(A)[:,1],np.array(A)[:,0]] = [0,0,255]

    # # rescale[np.array(B)[:,1],np.array(B)[:,0]] = [0,255,0]
    # # rescale[np.array(C)[:,1],np.array(C)[:,0]] = [255,0,0]
    # # rescale[np.array(D)[:,1],np.array(D)[:,0]] = [255,255,0]

    # # plt.plot(np.array(A)[:,1],np.array(A)[:,0],".")
    # # plt.plot(np.array(B)[:,1],np.array(B)[:,0],".")
    # # plt.plot(np.array(C)[:,1],np.array(C)[:,0],".")
    # # plt.plot(np.array(D)[:,1],np.array(D)[:,0],".")

    # # plt.show()

    # cv2.namedWindow('new', cv2.WINDOW_NORMAL)

    # rescale[res[:,1],res[:,0]] = [0,0,255]

    # # cv2.line(rescale,(A[0],A[1]),(B[0],B[1]),100)
    # # cv2.line(rescale,(D[0],D[1]),(C[0],C[1]),100)
    # # cv2.line(rescale,(C[0],C[1]),(A[0],A[1]),100)
    # # cv2.line(rescale,(D[0],D[1]),(B[0],B[1]),100)

    contours = [np.array(
        [
            [A[0],A[1]],
            [B[0],B[1]],
            [D[0],D[1]],
            [C[0],C[1]]
        ],
         dtype = np.int32)]

    warped = transform.four_point_transform(orig, countours * )

    # cv2.imshow('output',drawing)
    # # cv2.imshow("new",rescale)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    print("Exiting")

