"""
Loads harvested.json into the SQLite opportunity database.
Run after harvester.js completes.
Usage: python intelligence/load_to_db.py
"""
import sqlite3
import json
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent / "opportunity.db"
JSON_PATH = Path(__file__).parent / "harvested.json"


def load():
    if not JSON_PATH.exists():
        print(f"[!] No harvested.json found at {JSON_PATH}")
        print("    Run: node intelligence/harvester.js first")
        return

    records = json.loads(JSON_PATH.read_text())
    print(f"Loading {len(records)} records into database...")

    conn = sqlite3.connect(DB_PATH)
    saved = 0
    for p in records:
        try:
            conn.execute("""
                INSERT OR IGNORE INTO products
                (asin, marketplace, niche, title, author, price_ebook, price_paperback,
                 bsr_overall, bsr_category1, bsr_category1_rank, bsr_category2,
                 bsr_category2_rank, review_count, star_rating, pub_date,
                 page_count, on_ku, scraped_at, raw_json)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                p.get("asin"), p.get("marketplace"), p.get("niche"),
                p.get("title"), p.get("author"),
                p.get("price_ebook"), p.get("price_paperback"),
                p.get("bsr_overall"),
                p.get("bsr_category1"), p.get("bsr_category1_rank"),
                p.get("bsr_category2"), p.get("bsr_category2_rank"),
                p.get("review_count"), p.get("star_rating"),
                p.get("pub_date"), p.get("page_count"),
                1 if p.get("on_ku") else 0,
                p.get("scraped_at", datetime.now().isoformat()),
                json.dumps(p)
            ))
            saved += 1
        except Exception as e:
            print(f"  Skip {p.get('asin')}: {e}")

    conn.commit()

    # Summary
    for row in conn.execute("SELECT niche, marketplace, COUNT(*) FROM products GROUP BY niche, marketplace"):
        print(f"  {row[0]} | {row[1]}: {row[2]} products")

    conn.close()
    print(f"\nDone — {saved} records saved to database")


if __name__ == "__main__":
    load()
