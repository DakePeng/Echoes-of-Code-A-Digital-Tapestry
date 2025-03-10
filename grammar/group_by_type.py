import json
from collections import defaultdict
from nltk.corpus import wordnet as wn

def categorize_words(json_file, output_file):
    # Load words from JSON
    with open(json_file, 'r') as f:
        words = json.load(f)
    
    categories = defaultdict(list)

    for word in words:
        synsets = wn.synsets(word)
        if synsets:
            # Get the first synset's hypernym (general category)
            hypernyms = synsets[0].hypernyms()
            if hypernyms:
                category = hypernyms[0].lemmas()[0].name()
            else:
                category = "miscellaneous"
        else:
            category = "unknown"

        categories[category].append(word)

    # Remove 'unknown' and 'miscellaneous' categories and limit to those with more than 10 words
    categories = {k: v for k, v in categories.items() if k not in ["unknown", "miscellaneous"] and len(v) > 10}

    # Save categorized words to a JSON file
    with open(output_file, 'w') as outfile:
        json.dump(categories, outfile, indent=2)

# Example usage
json_file = "bag_of_words.json"  # Your JSON input file
output_file = "categorized_words.json"  # Output JSON file
categorize_words(json_file, output_file)
