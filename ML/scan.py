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
        i+=k[0]
        j+=k[1]

    return [int(i/l),int(j/l)]

def Conditions(Points,height,width):
    """
    y -> [0]
    x -> [1]

    """
    print(len(Points))
    m = height
    n = width
    print(" h",m,"\n","w",n)
    A = []
    B = []
    C = []
    D = []
    DIV_n = 4
    DIM_m = 2
    for i in Points:
        if i[0] <= m/DIV_n:       
            if i[1] <= n/DIV_n:
                A.append([i[0],i[1]])
            elif i[1] >= (DIV_n - 1)*n/DIV_n:
                B.append([i[0],i[1]])
            else:
                pass
        elif i[0] >= (DIM_m - 1)*m/DIM_m:
            if i[1] <= n/DIV_n:
                C.append([i[0],i[1]])
            elif i[1] >= (DIV_n - 1)*n/DIV_n:
                D.append([i[0],i[1]])
            else:
                pass
        else:
            pass

    if len(A) == 0:
        A = [[0,0]]
    if len(B) == 0:
        B = [[0,height-1]]
    if len(C) == 0:
        C = [[width-1,0]]
    if len(D) == 0:
        D = [[width-1,height-1]]

    A,B,C,D = list(map(lambda z: avg(z),[A,B,C,D]))  

    return A,B,C,D

    
def Cor_point(path):

    size = 500
    MORPH = 9
    CANNY = 84
    HOUGH = 25

    #cv2.namedWindow('Line_dect', cv2.WINDOW_NORMAL)

    image = cv2.imread(path)

    ratio = image.shape[0] / size

    rescaled_image = imutils.resize(image, height=int(size))
    img_lines = rescaled_image.copy()

    IM_HEIGHT, IM_WIDTH, _ = rescaled_image.shape

    # convert the image to grayscale and blur it slightly
    gray = cv2.cvtColor(rescaled_image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (7, 7), 0)

    # dilate helps to remove potential holes between edge segments
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (MORPH, MORPH))
    dilated = cv2.dilate(gray, kernel)

    # find edges and mark them in the output map using the Canny algorithm
    #edged = cv2.Canny(dilated, 0, CANNY)
    #lines = cv2.HoughLinesP(edged, 1, np.pi/180, 100)

    points = cv2.cornerHarris(dilated, 20, 15, 0.05,)
    #points = cv2.dilate(points, None)
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
    return res,IM_HEIGHT, IM_WIDTH

if __name__ == "__main__":
    path = "ML/Test5.jpg"
    
    res,h,w  = Cor_point(path)
    print(res)

    A,B,C,D = Conditions(res,h,w)

    image = cv2.imread(path)
    rescale = imutils.resize(image, height=int(500))


    # rescale[np.array(A)[:,1],np.array(A)[:,0]] = [0,0,255]

    # rescale[np.array(B)[:,1],np.array(B)[:,0]] = [0,255,0]
    # rescale[np.array(C)[:,1],np.array(C)[:,0]] = [255,0,0]
    # rescale[np.array(D)[:,1],np.array(D)[:,0]] = [255,255,0]

    # plt.plot(np.array(A)[:,1],np.array(A)[:,0],".")
    # plt.plot(np.array(B)[:,1],np.array(B)[:,0],".")
    # plt.plot(np.array(C)[:,1],np.array(C)[:,0],".")
    # plt.plot(np.array(D)[:,1],np.array(D)[:,0],".")

    # plt.show()    

    cv2.namedWindow('new', cv2.WINDOW_NORMAL)

    
    rescale[res[:,1],res[:,0]] = [0,0,255]
    
    # cv2.line(rescale,(A[0],A[1]),(B[0],B[1]),100)
    # cv2.line(rescale,(D[0],D[1]),(C[0],C[1]),100)
    # cv2.line(rescale,(C[0],C[1]),(A[0],A[1]),100)
    # cv2.line(rescale,(D[0],D[1]),(B[0],B[1]),100)
    
    contours = [np.array(
        [
            [A[0],A[1]],
            [B[0],B[1]],
            [D[0],D[1]],
            [C[0],C[1]]
        ],
         dtype = np.int32)]

    drawing = np.zeros([600, 600],np.uint8)
    for cnt in contours:
        cv2.drawContours(drawing,[cnt],0,(255,255,255),2)

    cv2.imshow('output',drawing)
    # cv2.imshow("new",rescale)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    print("Exiting")


"""

1. cornor points
2. Grid based avergaing
3. local database storage
4. Image to dot matrix
5. api integration

[103.0, 25.0]

[333.3333333333333, 222.0]

[602.0, 22.666666666666668]

[395.5, 481.5]
"""
