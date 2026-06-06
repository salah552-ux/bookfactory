"""
Amazon KDP Intelligence Harvester — REFERENCE ONLY
====================================================
WARNING: This script uses requests + BeautifulSoup for HTTP scraping.
Amazon detects and blocks this approach (CAPTCHA / 503 responses) almost immediately.

THE ACTUAL HARVEST METHOD is the harvester-agent.md agent, which uses
Playwright's browser_evaluate() in a real browser session. This Python file
is kept as a reference for the data structures and DB-write logic only.

DO NOT call this script expecting it to successfully harvest Amazon data.
Use: `harvest [niche]` to invoke the real harvester-agent via Playwright.

If you need to load pre-scraped data from a file, see load_to_db.py instead.

Original run intent: python intelligence/harvester.py [niche] [marketplace]
"""

import sqlite3
import json
import time
import re
import sys
from datetime import datetime
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4", "lxml"])
    import requests
    from bs4 import BeautifulSoup

DB_PATH = Path(__file__).parent / "opportunity.db"
NICHES_PATH = Path(__file__).parent / "niches.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-GB,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

MARKETPLACES = {
    "UK": "https://www.amazon.co.uk",
    "US": "https://www.amazon.com",
}


def get_page(url: str, session: requests.Session, retries: int = 2) -> BeautifulSoup | None:
    for attempt in range(retries):
        try:
            resp = session.get(url, headers=HEADERS, timeout=15)
            if resp.status_code == 200:
                return BeautifulSoup(resp.text, "lxml")
            if resp.status_code == 503:
                print(f"  [!] Amazon bot check on attempt {attempt+1}. Waiting...")
                time.sleep(5 * (attempt + 1))
        except Exception as e:
            print(f"  [!] Request error: {e}")
            time.sleep(3)
    return None


def parse_price(text: str) -> float | None:
    if not text:
        return None
    match = re.search(r"[\d,]+\.?\d*", text.replace(",", ""))
    return float(match.group()) if match else None


def parse_int(text: str) -> int | None:
    if not text:
        return None
    match = re.search(r"[\d,]+", text.replace(",", ""))
    return int(match.group().replace(",", "")) if match else None


def scrape_search_page(soup: BeautifulSoup) -> list:
    products = []
    for el in soup.select("[data-asin]"):
        asin = el.get("data-asin", "")
        if not asin or len(asin) < 5:
            continue
        title_el = el.select_one("h2 span")
        price_el = el.select_one(".a-price .a-offscreen")
        rating_el = el.select_one("[aria-label*='out of 5 stars']")
        review_el = el.select_one(".a-size-base.s-underline-text")
        ku = bool(el.select_one(".a-badge-supplemental, [aria-label*='Kindle Unlimited']"))

        title = title_el.get_text(strip=True) if title_el else None
        if not title:
            continue

        raw_reviews = review_el.get_text(strip=True) if review_el else ""
        review_count = parse_int(raw_reviews) if re.search(r"[\d,]+", raw_reviews) else None
        rating_text = rating_el.get("aria-label", "") if rating_el else ""
        rating_match = re.search(r"([\d.]+) out of", rating_text)
        rating = float(rating_match.group(1)) if rating_match else None

        products.append({
            "asin": asin,
            "title": title,
            "price_ebook": parse_price(price_el.get_text() if price_el else ""),
            "star_rating": rating,
            "review_count": review_count,
            "on_ku": ku,
        })
    # Deduplicate by ASIN
    seen = set()
    unique = []
    for p in products:
        if p["asin"] not in seen:
            seen.add(p["asin"])
            unique.append(p)
    return unique


def scrape_product_bsr(asin: str, base_url: str, session: requests.Session) -> dict:
    url = f"{base_url}/dp/{asin}"
    soup = get_page(url, session)
    if not soup:
        return {}

    result = {}

    # BSR from detail bullets
    bsr_data = []
    for li in soup.select("#detailBullets_feature_div li"):
        text = li.get_text(" ", strip=True)
        if "#" in text and ("Kindle" in text or "Books" in text or "Store" in text):
            bsr_data.append(text)

    if bsr_data:
        # Parse first BSR entry (overall)
        first = bsr_data[0]
        overall_match = re.search(r"#([\d,]+) in", first)
        if overall_match:
            result["bsr_overall"] = parse_int(overall_match.group(1))
        # Category name
        cat_match = re.search(r"in (.+?)(?:\s*\(|$)", first)
        if cat_match:
            result["bsr_category1"] = cat_match.group(1).strip()
        if len(bsr_data) > 1:
            second = bsr_data[1]
            rank2 = re.search(r"#([\d,]+)", second)
            cat2 = re.search(r"in (.+?)(?:\s*\(|$)", second)
            if rank2:
                result["bsr_category2_rank"] = parse_int(rank2.group(1))
            if cat2:
                result["bsr_category2"] = cat2.group(1).strip()

    # Pages
    for li in soup.select("#detailBullets_feature_div li"):
        text = li.get_text(" ", strip=True)
        if "print length" in text.lower() or "pages" in text.lower():
            pages_match = re.search(r"([\d,]+)\s*pages", text, re.IGNORECASE)
            if pages_match:
                result["page_count"] = parse_int(pages_match.group(1))
            break

    # Publication date
    for li in soup.select("#detailBullets_feature_div li"):
        text = li.get_text(" ", strip=True)
        if "publication date" in text.lower() or "date first" in text.lower():
            result["pub_date"] = text.split(":")[-1].strip()
            break

    # KU check
    result["on_ku"] = bool(soup.select_one("[data-action='kindle-unlimited-button']"))

    # Kindle price
    price_el = soup.select_one(".kindle-price .a-price .a-offscreen, #kindle-price")
    if price_el:
        result["price_ebook"] = parse_price(price_el.get_text())

    # Review count
    review_el = soup.select_one("#acrCustomerReviewText")
    if review_el:
        result["review_count"] = parse_int(review_el.get_text())

    # Rating
    rating_el = soup.select_one("#acrPopover")
    if rating_el:
        rating_match = re.search(r"([\d.]+) out of", rating_el.get("title", ""))
        if rating_match:
            result["star_rating"] = float(rating_match.group(1))

    return result


def save_products(products: list, niche: str, marketplace: str):
    conn = sqlite3.connect(DB_PATH)
    saved = 0
    now = datetime.now().isoformat()
    for p in products:
        try:
            conn.execute("""
                INSERT OR IGNORE INTO products
                (asin, marketplace, niche, title, author, price_ebook, price_paperback,
                 bsr_overall, bsr_category1, bsr_category1_rank, bsr_category2,
                 bsr_category2_rank, review_count, star_rating, pub_date,
                 page_count, on_ku, scraped_at, raw_json)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                p.get("asin"), marketplace, niche,
                p.get("title"), p.get("author"),
                p.get("price_ebook"), p.get("price_paperback"),
                p.get("bsr_overall"),
                p.get("bsr_category1"), p.get("bsr_category1_rank"),
                p.get("bsr_category2"), p.get("bsr_category2_rank"),
                p.get("review_count"), p.get("star_rating"),
                p.get("pub_date"), p.get("page_count"),
                1 if p.get("on_ku") else 0,
                now, json.dumps(p)
            ))
            saved += 1
        except Exception as e:
            print(f"  [DB] Skip {p.get('asin')}: {e}")
    conn.commit()
    conn.close()
    return saved


def harvest_niche(niche_config: dict, marketplace: str):
    name = niche_config["name"]
    base_url = MARKETPLACES[marketplace]
    search_terms = niche_config["search_terms"]

    print(f"\n{'='*50}")
    print(f"Harvesting: {name} | {marketplace}")
    print(f"{'='*50}")

    session = requests.Session()
    all_products = {}

    for term in search_terms[:3]:  # Top 3 search terms per niche
        encoded = term.replace(" ", "+")
        url = f"{base_url}/s?k={encoded}&i=digital-text"
        print(f"\n  Searching: '{term}'")
        soup = get_page(url, session)
        if not soup:
            print(f"  [!] Could not fetch results for '{term}'")
            continue

        products = scrape_search_page(soup)
        print(f"  Found {len(products)} products")
        for p in products:
            if p["asin"] not in all_products:
                all_products[p["asin"]] = p

        time.sleep(2)  # Be polite

    print(f"\n  Total unique products: {len(all_products)}")

    # Get BSR for top 20 products
    product_list = list(all_products.values())
    print(f"\n  Getting BSR for top {min(20, len(product_list))} products...")

    for i, p in enumerate(product_list[:20]):
        print(f"  [{i+1}/20] {p['asin']} - {p['title'][:50]}...")
        bsr_data = scrape_product_bsr(p["asin"], base_url, session)
        p.update(bsr_data)
        print(f"    BSR: {p.get('bsr_overall', 'N/A')} | Reviews: {p.get('review_count', 'N/A')} | KU: {p.get('on_ku', False)}")
        time.sleep(1.5)

    saved = save_products(product_list, name, marketplace)
    print(f"\n  Saved {saved} products to database")
    return saved


def main():
    niches = json.loads(NICHES_PATH.read_text())["niches"]

    target_niche = sys.argv[1] if len(sys.argv) > 1 else None
    target_marketplace = sys.argv[2] if len(sys.argv) > 2 else None

    total_saved = 0
    for niche in niches:
        if target_niche and niche["name"] != target_niche:
            continue
        for marketplace in niche["marketplaces"]:
            if target_marketplace and marketplace != target_marketplace:
                continue
            saved = harvest_niche(niche, marketplace)
            total_saved += saved

    print(f"\n{'='*50}")
    print(f"HARVEST COMPLETE — {total_saved} total products saved")
    print(f"Run: python intelligence/analyzer.py to analyse")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
