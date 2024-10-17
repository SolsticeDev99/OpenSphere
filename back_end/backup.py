from sklearn.preprocessing import LabelEncoder
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import cv2 as cv
import os
from keras import layers, models
from sklearn.model_selection import train_test_split

# Data Augmentation Function


def augment_image(image):
    # Randomly flip the image
    if np.random.rand() > 0.5:
        image = cv.flip(image, 1)  # Horizontal flip

    # Randomly rotate the image
    angle = np.random.randint(-30, 30)
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv.getRotationMatrix2D(center, angle, 1.0)
    image = cv.warpAffine(image, M, (w, h))

    return image


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

                # Augment the image
                augmented_pic = augment_image(pic)

                image_list.append(augmented_pic)
                label_list.append(animal)

images = np.array(image_list)
labels = np.array(label_list)

le = LabelEncoder()
labels = le.fit_transform(labels)
print(labels)

train_images, test_images, train_labels, test_labels = train_test_split(
    images, labels, test_size=0.2, random_state=42, stratify=labels
)

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

train_images, test_images = train_images / 255, test_images / 255

# Showing Image
for i in range(16):
    plt.subplot(4, 4, i + 1)
    plt.xticks([])
    plt.yticks([])
    plt.imshow(train_images[i], cmap=plt.cm.binary)
    plt.xlabel(le.inverse_transform([train_labels[i]])[0])

plt.show()  # Close the plt window to resume the code. plt window is only to view the images!

# Training
# ==========================================
model = models.Sequential()
model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=(80, 80, 3)))
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Conv2D(64, (3, 3), activation='relu'))
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Conv2D(64, (3, 3), activation='relu'))
model.add(layers.Flatten())
model.add(layers.Dense(64, activation='relu'))

num_class = len(le.classes_)
model.add(layers.Dense(num_class, activation='softmax'))

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy', metrics=['accuracy'])

model.fit(train_images, train_labels, epochs=10,
          validation_data=(test_images, test_labels))

loss, accuracy = model.evaluate(test_images, test_labels)
print(f"loss: {loss}")
print(f"accuracy: {accuracy}")

# Testing
# =======================================================
model.save("image_classifier.keras")

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
