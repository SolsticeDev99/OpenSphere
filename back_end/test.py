import zipfile
import os
import numpy as np
import cv2 as cv

# Step 1: Extract the zip file
zip_file_path = ''  # Replace with the path to your zip file
extract_path = 'animals'  # Directory to extract to

# Extract the zip file
with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

print(f"Extracted zip file to '{extract_path}'")

# Step 2: Load images from folders
main_path = extract_path  # Use the extracted folder path
image_list = []
label_list = []

# Iterate through each folder (animal) in the main directory
for animal in os.listdir(main_path):
    animal_folder_path = os.path.join(main_path, animal)
    
    # Check if it's a directory
    if os.path.isdir(animal_folder_path):
        for img in os.listdir(animal_folder_path):
            if img.endswith(".jpg") or img.endswith(".png") or img.endswith(".jpeg"):
                # Construct the full image path
                img_path = os.path.join(animal_folder_path, img)
                
                # Read and preprocess the image
                pic = cv.imread(img_path)
                pic = cv.cvtColor(pic, cv.COLOR_BGR2RGB)  # Convert from BGR to RGB
                pic = cv.resize(pic, (80, 80))  # Resize to a uniform size
                
                # Append to the lists
                image_list.append(pic)
                label_list.append(animal)  # Use the folder name as the label

# Convert the lists to NumPy arrays
training_images = np.array(image_list) / 255.0  # Normalize pixel values
training_labels = np.array(label_list)

# Save preprocessed data
np.save("training_images.npy", training_images)
np.save("training_labels.npy", training_labels)

print(f"Loaded {len(training_images)} images and labels.")
