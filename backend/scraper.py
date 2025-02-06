import feedparser
from newspaper import Article

def get_news_urls(topic):
    """Fetches news article URLs from Google News RSS feed"""
    rss_url = f"https://news.google.com/rss/search?q={topic.replace(' ', '%20')}&hl=en-US&gl=US&ceid=US:en"
    feed = feedparser.parse(rss_url)

    urls = []
    for entry in feed.entries:
        urls.append(entry.link)  # Extract real article link

    return urls

def scrape_articles(topic):
    """Scrapes article text from valid URLs"""
    articles = []
    urls = get_news_urls(topic)
    
    print("Found URLs:", urls)
    
    for url in urls:
        try:
            article = Article(url)
            article.download()
            article.parse()

            if article.text.strip():
                articles.append(article.text)
                print("Extracted text (preview):", article.text[:500])
            else:
                print(f"Skipping {url}: No text extracted")
        except Exception as e:
            print(f"Failed to process {url}: {e}")

    return articles



