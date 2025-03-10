import requests
from bs4 import BeautifulSoup

# Base URL for Project Gutenberg search results
base_url = "https://www.gutenberg.org/ebooks/search/?query=plato&submit_search=Go%21"

# Function to fetch and parse the list of Plato's books
def get_plato_books():
    response = requests.get(base_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all book links on the search results page
    book_links = []
    for link in soup.find_all('a', href=True):
        if '/ebooks/' in link['href']:
            book_title = link.get_text(strip=True)
            clean_title = book_title.split('Plato')[0].strip()
            book_url = "https://www.gutenberg.org" + link['href']
            book_links.append((clean_title, book_url))
    return book_links

# Function to fetch the content of each book and save it to a .txt file
def save_books_to_txt(book_links):
    for title, url in book_links:
        # Request the book page
        book_response = requests.get(url)
        book_soup = BeautifulSoup(book_response.text, 'html.parser')

        # Find the link to the plain text version of the book (text/plain; charset=us-ascii)
        book_text_url = None
        for link in book_soup.find_all('a', href=True):
            if 'txt.utf-8' in link['href']:
                book_text_url = "https://www.gutenberg.org" + link['href']
                break

        if book_text_url:
            # Download the book in plain text
            text_response = requests.get(book_text_url)

            # Save the text to a .txt file
            file_name = title.replace(" ", "_") + ".txt"
            with open("./Plato_Books/" + file_name, 'w', encoding='utf-8') as file:
                file.write(text_response.text)

            print(f"Saved: {file_name}")
        else:
            print(f"Plain text version not found for: {title}")

# Main execution
if __name__ == "__main__":
    plato_books = get_plato_books()
    save_books_to_txt(plato_books)
