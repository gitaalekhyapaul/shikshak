import cv2
import imutils
import numpy as np
import matplotlib.pyplot as plt

import transform

from SpecialDB import dbWithPick

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

    gray = cv2.cvtColor(rescaled_image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (7, 7), 0)

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

        db.add_overwrite(uid, [A, B, C, D])

        cv2.line(image, A, B, (128, 255, 64), 5)
        cv2.line(image, D, C, (128, 255, 64), 5)
        cv2.line(image, C, A, (128, 255, 64), 5)
        cv2.line(image, D, B, (128, 255, 64), 5)

        if PROD:
            cv2.imwrite(path, image)
        else:
            cv2.namedWindow('new', cv2.WINDOW_NORMAL)
            cv2.imshow("new", image)
            # cv2.waitKey(0)
        return True
    except:
        print("Error in find points")
        return False


def pixeldata(img):
    el = []
    boool = (img != 255)
    for i in range(boool.shape[0]):
        for j in range(boool.shape[1]):
            if boool[i,j] == True:
                el.append([j,i])

    return el


def convert(uid, path):
    # try:
        image = cv2.imread(path)

        IM_HEIGHT, IM_WIDTH, _ = image.shape

        A, B, C, D = db.getpoints(uid)

        countours = np.array([
                [A[0], A[1]],
                [B[0], B[1]],
                [C[0], C[1]],
                [D[0], D[1]]
            ], dtype=np.int32)

        warped = transform.four_point_transform(image, countours)

        gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)

        # sharpen image
        sharpen = cv2.GaussianBlur(gray, (0, 0), 3)
        sharpen = cv2.addWeighted(gray, 1.5, sharpen, -0.5, 0)

         # apply adaptive threshold to get black and white effect
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 15)

        z = pixeldata(thresh)

        if PROD != True:
            cv2.namedWindow('new', cv2.WINDOW_NORMAL)
            cv2.imshow("new", thresh)
            cv2.waitKey(0)

        return z, True,IM_HEIGHT, IM_WIDTH
    # except:
        print("Error in the Convert file")
        return -1, False


PROD = True

db = dbWithPick("./")

if __name__ == "__main__":
    path = "ML/Test5.jpg"
    uid = "resderf"

    print("Starting")

    response = findPoints(uid, path)
    print(len(db))
    convert(uid, path)

    print("Exiting")
