import requests
from bs4 import BeautifulSoup
import csv
import re
import time
import math

def get_max_pages(soup):
    pagination_div = soup.find('div', id='reviewPagination')
    page_links = pagination_div.find_all('a') if pagination_div else []
    page_numbers = [int(re.search(r'page=(\d+)', link.get('href')).group(1)) for link in page_links if re.search(r'page=(\d+)', link.get('href'))]
    max_page = max(page_numbers) if page_numbers else 1
    return max_page

def scrape_goodreads_shelf(user_id, shelf):
    base_url = f"https://www.goodreads.com/review/list/{user_id}?shelf={shelf}"

    # Start by making a request to the first page to get max pages
    response = requests.get(f"{base_url}&per_page=30&page=1")
    if response.status_code != 200:
        print("Failed to retrieve data")
        return

    # Parse the first page to find out the number of max pages
    soup = BeautifulSoup(response.text, 'html.parser')
    max_pages = get_max_pages(soup)

    with open('goodreads_books.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Title', 'Author'])

        # Iterate over all pages
        for page in range(1, max_pages + 1):
            # Make a request to each page
            response = requests.get(f"{base_url}&per_page=30&page={page}")
            if response.status_code != 200:
                print(f"Failed to retrieve data for page {page}")
                continue

            soup = BeautifulSoup(response.text, 'html.parser')
            books = soup.find_all('tr', class_='bookalike review')
            for book in books:
                title_div = book.find('td', class_='field title')
                author_div = book.find('td', class_='field author')
                title = title_div.find('a').get('title') if title_div else 'No Title Found'
                author = author_div.find('div', class_='value').get_text(strip=True) if author_div else 'No Author Found'
                writer.writerow([title, author])

            # Be polite and don't hammer the server; pause between page requests
            time.sleep(1)

if __name__ == "__main__":
    user_id = "56074482-soumya-karwa"
    shelf = "read"
    scrape_goodreads_shelf(user_id, shelf)
