import os
from compare_images import compare_images
from logger import Logger
import csv

logger = Logger().get_logger()

# Update these variables as per need
raw_sub_dir = 'raw'
base_image_file = 'base_image.jpg'
similarity_threshold = 90

# Create an empty list to store results
results = []

# Loop through all files in raw_sub_dir
for filename in os.listdir(raw_sub_dir):
    if filename.endswith(".jpg"):
        captured_image_path = os.path.join(raw_sub_dir, filename)

        # Skip processing if the file is the base image
        if captured_image_path == base_image_file:
            continue

        # Compare the images
        similarity_percentage = compare_images(base_image_file, captured_image_path)
        logger.debug(f"{similarity_percentage}: Similarity percentage for {captured_image_path}")

        # Save results in the list
        results.append({
            'filename': filename,
            'similarity_percentage': similarity_percentage
        })

# Save results to a CSV file
csv_filename = 'image_comparison_results.csv'
csv_path = os.path.join(csv_filename)

with open(csv_path, 'w', newline='') as csvfile:
    fieldnames = ['filename', 'similarity_percentage']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for result in results:
        writer.writerow(result)

logger.info(f"Image comparison results saved to {csv_path}")
