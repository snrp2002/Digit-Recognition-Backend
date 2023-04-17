import matplotlib.image as mpimg
import joblib
import cv2
# import base64
# import sys
try:
    loaded_model = joblib.load("model.pkl")

    # encoded_b64 = sys.argv[1]
    # decoded_b64= base64.b64decode(encoded_b64.split(',')[1])

    # img_file = open('image.jpg', 'wb')
    # img_file.write(decoded_b64)
    # img_file.close()

    image = mpimg.imread('image.jpg')

    resized_image = cv2.resize(image, (28, 28), interpolation = cv2.INTER_LINEAR)
    resized_image = cv2.bitwise_not(resized_image)
    resized_image = resized_image[:, :, 0]

    temp = resized_image.reshape(1, 28, 28, 1)
    temp = temp/255
    result = loaded_model.predict(temp, verbose=False)
    result = result.argmax(axis=1)
    print(result[0])
except:
    print("Something went wrong")