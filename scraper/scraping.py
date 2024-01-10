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
        writer.writerow(['Title', 'Author', 'Length', 'Rating', 'Date Published', 'Date Read', 'Read Count', 'ISBN13 Number', 'Cover Image'])

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
                
                # BOOK TITLE
                title_div = book.find('td', class_='field title')
                title = title_div.find('a').get('title') if title_div else 'No Title Found'

                # AUTHOR
                author_div = book.find('td', class_='field author')
                author = author_div.find('div', class_='value').get_text(strip=True) if author_div else 'No Author Found'
                
                # LENGTH
                length_div = book.find('td', class_='field num_pages')
                length = book.find('td', class_='field num_pages').find('nobr').get_text(strip=True)
                
                # BOOK COVER
                cover_div = book.find('td', class_='field cover')
                cover = cover_div.find('img')['src'] if cover_div and cover_div.find('img') else 'No Image Found'

                # RATING
                rating_div = book.find('td', class_='field rating')
                rating = 0
                stars = rating_div.find_all('span', class_='staticStar') if rating_div else 'No Rating Found'
                rating = sum(1 for star in stars if 'p10' in star['class'])

                # YEAR PUBLISHED
                date_pub_div = book.find('td', class_='field date_pub').find('div', class_='value')
                date_published = date_pub_div.get_text(strip=True) if date_pub_div else 'No Date Published'

                # YEAR READ
                date_read_div = book.find('td', class_='field date_read').find('span', class_='date_read_value')
                date_read = date_read_div.get_text(strip=True) if date_read_div else 'Date Not Set'

                # READ COUNT
                read_count_div = book.find('td', class_='field read_count').find('div', class_='value')
                read_count = read_count_div.get_text(strip=True) if date_pub_div else 'No Read Count'

                # ISBN 13 NUMBER
                isbn13_div = book.find('td', class_='field isbn13').find('div', class_='value')
                isbn13 = isbn13_div.get_text(strip=True) if isbn13_div else 'No ISBN Number'

                writer.writerow([title, author, length, rating, date_published, date_read, read_count, isbn13, cover])

            # Be polite and don't hammer the server; pause between page requests
            time.sleep(1)

if __name__ == "__main__":
    user_id = "56074482-soumya-karwa"
    shelf = "read"
    scrape_goodreads_shelf(user_id, shelf)
