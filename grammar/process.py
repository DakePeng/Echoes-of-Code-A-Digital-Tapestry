import re
import json
import nltk
from collections import Counter
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Ensure NLTK dependencies are downloaded
nltk.download('punkt')
nltk.download('stopwords')

def preprocess_and_count_words(file_path, output_text_path, output_json_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()

    # Convert to lowercase
    text = text.lower()

    # Remove special characters and punctuation
    text = re.sub(r'[^\w\s]', '', text)

    # Tokenize text
    words = word_tokenize(text)

    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word not in stop_words]
    
    # Count word occurrences
    word_counts = Counter(words)

    # Save processed text
    with open(output_text_path, 'w', encoding='utf-8') as out_file:
        out_file.write(' '.join(words))

    # Save word counts to JSON
    with open(output_json_path, 'w', encoding='utf-8') as json_file:
        json.dump(word_counts, json_file, indent=4)

# Example usage
preprocess_and_count_words('The_Republic.txt', 'processed_output.txt', 'word_counts.json')
