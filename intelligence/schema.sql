CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asin TEXT NOT NULL,
    marketplace TEXT NOT NULL,           -- 'UK' or 'US'
    niche TEXT NOT NULL,
    title TEXT,
    author TEXT,
    price_ebook REAL,
    price_paperback REAL,
    bsr_overall INTEGER,
    bsr_category1 TEXT,
    bsr_category1_rank INTEGER,
    bsr_category2 TEXT,
    bsr_category2_rank INTEGER,
    review_count INTEGER,
    star_rating REAL,
    pub_date TEXT,
    page_count INTEGER,
    on_ku INTEGER DEFAULT 0,
    scraped_at TEXT NOT NULL,
    raw_json TEXT,
    UNIQUE(asin, marketplace, scraped_at)
);

CREATE TABLE IF NOT EXISTS niches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    search_terms TEXT,                   -- JSON array
    amazon_category TEXT,
    last_scanned TEXT
);

CREATE TABLE IF NOT EXISTS scan_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    niche TEXT NOT NULL,
    marketplace TEXT NOT NULL,
    run_at TEXT NOT NULL,
    products_found INTEGER DEFAULT 0,
    status TEXT DEFAULT 'running'        -- 'running', 'complete', 'failed'
);

CREATE TABLE IF NOT EXISTS blueprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    niche TEXT NOT NULL,
    generated_at TEXT NOT NULL,
    opportunity_score INTEGER,
    product_title TEXT,
    recommended_price REAL,
    target_bsr INTEGER,
    angle TEXT,
    content_gaps TEXT,                   -- JSON array
    full_blueprint TEXT                  -- Full Opus output JSON
);
