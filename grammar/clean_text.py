def remove_gutenberg_metadata(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as file:
        lines = file.readlines()

    start_marker = "*** START OF THE PROJECT GUTENBERG EBOOK"
    end_marker = "*** END OF THE PROJECT GUTENBERG EBOOK"

    start_idx = next((i for i, line in enumerate(lines) if start_marker in line), None)
    end_idx = next((i for i, line in enumerate(lines) if end_marker in line), None)

    if start_idx is not None and end_idx is not None:
        clean_text = lines[start_idx+1:end_idx]
    else:
        clean_text = lines  # If markers aren't found, keep original text

    with open(output_file, "w", encoding="utf-8") as file:
        file.writelines(clean_text)

import os

input_folder_path = './Plato_Books'
output_folder_path = './Plato_Books_Cleaned'
for filename in os.listdir(input_folder_path):
    if filename.endswith('.txt'):
        input_file_path = os.path.join(input_folder_path, filename)
        output_file_path = os.path.join(output_folder_path, filename)
        remove_gutenberg_metadata(input_file_path, output_file_path)
