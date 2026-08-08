import sqlite3
import uuid
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent.parent / "data" / "history.db"
UPLOADS_DIR = Path(__file__).parent.parent / "data" / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY,
            image_filename TEXT NOT NULL,
            predicted_class TEXT,
            crop TEXT,
            disease TEXT,
            confidence REAL,
            solution_brief TEXT,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def save_history_entry(image_bytes: bytes, predicted_class: str, crop: str,
                        disease: str, confidence: float, solution_brief: str) -> dict:
    entry_id = str(uuid.uuid4())
    image_filename = f"{entry_id}.jpg"
    with open(UPLOADS_DIR / image_filename, "wb") as f:
        f.write(image_bytes)

    created_at = datetime.utcnow().isoformat()

    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """INSERT INTO history
           (id, image_filename, predicted_class, crop, disease, confidence, solution_brief, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (entry_id, image_filename, predicted_class, crop, disease, confidence, solution_brief, created_at)
    )
    conn.commit()
    conn.close()

    return {
        "id": entry_id, "image_filename": image_filename,
        "predicted_class": predicted_class, "crop": crop, "disease": disease,
        "confidence": confidence, "solution_brief": solution_brief, "created_at": created_at,
    }


def get_all_history() -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM history ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_history_entry(entry_id: str) -> dict | None:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    row = conn.execute("SELECT * FROM history WHERE id = ?", (entry_id,)).fetchone()
    conn.close()
    return dict(row) if row else None