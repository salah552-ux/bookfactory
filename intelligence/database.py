import sqlite3
import json
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent / "opportunity.db"
SCHEMA_PATH = Path(__file__).parent / "schema.sql"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA_PATH.read_text())
    conn.commit()
    conn.close()


def start_scan(niche: str, marketplace: str) -> int:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.execute(
        "INSERT INTO scan_runs (niche, marketplace, run_at, status) VALUES (?,?,?,?)",
        (niche, marketplace, datetime.now().isoformat(), "running")
    )
    run_id = cur.lastrowid
    conn.commit()
    conn.close()
    return run_id


def finish_scan(run_id: int, products_found: int, status: str = "complete"):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "UPDATE scan_runs SET products_found=?, status=? WHERE id=?",
        (products_found, status, run_id)
    )
    conn.execute(
        "UPDATE niches SET last_scanned=? WHERE name=(SELECT niche FROM scan_runs WHERE id=?)",
        (datetime.now().isoformat(), run_id)
    )
    conn.commit()
    conn.close()


def save_products(products: list, niche: str, marketplace: str):
    conn = sqlite3.connect(DB_PATH)
    saved = 0
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
                datetime.now().isoformat(),
                json.dumps(p)
            ))
            saved += 1
        except Exception as e:
            print(f"[DB] skipped {p.get('asin')}: {e}")
    conn.commit()
    conn.close()
    return saved


def save_blueprint(niche: str, blueprint: dict):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        INSERT INTO blueprints
        (niche, generated_at, opportunity_score, product_title,
         recommended_price, target_bsr, angle, content_gaps, full_blueprint)
        VALUES (?,?,?,?,?,?,?,?,?)
    """, (
        niche, datetime.now().isoformat(),
        blueprint.get("opportunity_score"),
        blueprint.get("product_title"),
        blueprint.get("recommended_price"),
        blueprint.get("target_bsr"),
        blueprint.get("angle"),
        json.dumps(blueprint.get("content_gaps", [])),
        json.dumps(blueprint)
    ))
    conn.commit()
    conn.close()


def get_latest_products(niche: str, marketplace: str = None, limit: int = 200) -> list:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    query = "SELECT * FROM products WHERE niche=?"
    params = [niche]
    if marketplace:
        query += " AND marketplace=?"
        params.append(marketplace)
    query += " ORDER BY scraped_at DESC LIMIT ?"
    params.append(limit)
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


if __name__ == "__main__":
    init_db()
    print(f"Database initialised at: {DB_PATH}")
