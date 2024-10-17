from sklearn.preprocessing import LabelEncoder
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import cv2 as cv
import os
from keras import layers, models, datasets
from sklearn.model_selection import train_test_split


main_path = "animals"

image_list = []
label_list = []

for animal in os.listdir(main_path):
    animal_folder_path = os.path.join(main_path, animal)

    if os.path.isdir(animal_folder_path):
        for img in os.listdir(animal_folder_path):
            if img.endswith(".jpg") or img.endswith(".png") or img.endswith(".jpeg"):

                pic = cv.imread(os.path.join(animal_folder_path, img))

                pic = cv.cvtColor(pic, cv.COLOR_BGR2RGB)

                pic = cv.resize(pic, (80, 80))

                image_list.append(pic)
                label_list.append(animal)

images = np.array(image_list)
labels = np.array(label_list)

le = LabelEncoder()
labels = le.fit_transform(labels)
print(labels)

train_images, test_images, train_labels, test_labels = train_test_split(
    images, labels, test_size=0.2, random_state=42, stratify=labels)


np.save("train_images.npy", train_images)
np.save("train_labels.npy", train_labels)
np.save("test_images.npy", test_images)
np.save("test_labels.npy", test_labels)

print(f"Successfully split and saved {len(train_images)} training images and {
      len(test_images)} testing images.")


train_images = np.load("train_images.npy")
train_labels = np.load("train_labels.npy")
test_images = np.load("test_images.npy")
test_labels = np.load("test_labels.npy")

train_images, test_images = train_images/255, test_images/255


# showing image
# =====================================================


# print(type(train_labels))
# print(train_labels[:10])

# Class_names = ["Dolphin", "Elephant", "Flamingo", "Gorilla", "Hippopotamus", "Koala", "Leopard", "Lion",
#                "Octopus", "Orangutan", "Panda", "Penguin", "Rhinoceros", "Shark", "Tiger", "Turtle", "Wale"]

for i in range(16):
    plt.subplot(4, 4, i+1)
    plt.xticks([])
    plt.yticks([])
    plt.imshow(train_images[i], cmap=plt.cm.binary)
    plt.xlabel(le.inverse_transform([train_labels[i]])[0])

plt.show()  # close the plt window to resume the code. plt window is only to view the images!


# Trainig
# ==========================================

# train_images = train_images[:20000]
# train_labels = train_labels[:20000]
# test_images = test_images[:4000]
# test_labels = test_labels[:4000]

# model = models.Sequential()
# model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=(80, 80, 3)))
# model.add(layers.MaxPooling2D((2, 2)))
# model.add(layers.Conv2D(64, (3, 3), activation='relu'))
# model.add(layers.MaxPooling2D((2, 2)))
# model.add(layers.Conv2D(64, (3, 3), activation='relu'))
# model.add(layers.Flatten())
# model.add(layers.Dense(64, activation='relu'))

# num_class = len(le.classes_)
# model.add(layers.Dense(num_class, activation='softmax'))


# model.compile(optimizer='adam',
#               loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# model.fit(train_images, train_labels, epochs=10,
#           validation_data=(test_images, test_labels))


# loss, accuracy = model.evaluate(test_images, test_labels)
# print(f"loss: {loss}")
# print(f"acuraccy: {accuracy}")


# Testing
# =======================================================

# model.save("image_classifier.keras")

model = models.load_model("image_classifier.keras")

img = cv.imread("test_img/horse-8193368_1280.jpg")

if img is None:
    print("image not found")
else:
    img = cv.cvtColor(img, cv.COLOR_BGR2RGB)
    img = cv.resize(img, (80, 80))

plt.imshow(img, cmap=plt.cm.binary)

prediction = model.predict(np.array([img]) / 255)
index = np.argmax(prediction)
print(f'Prediction is {le.inverse_transform([index])[0]}')
print(train_images.size)
