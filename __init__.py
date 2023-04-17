import matplotlib.image as mpimg
import joblib
import cv2
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'
try:
    loaded_model = joblib.load("model.pkl")
    image = mpimg.imread('image.jpg')

    resized_image = cv2.resize(image, (28, 28), interpolation = cv2.INTER_LINEAR)
    resized_image = cv2.bitwise_not(resized_image)
    resized_image = resized_image[:, :, 0]

    temp = resized_image.reshape(1, 28, 28, 1)
    temp = temp/255
    result = loaded_model.predict(temp, verbose=False)
    result = result.argmax(axis=1)
    print(result[0], end='')
except:
    raise Exception("Error")