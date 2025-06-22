"""Helper for loading exam questions and vocabulary into the database."""

from __future__ import annotations

import json
from pathlib import Path
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models


def _import(data: dict, db: Session) -> None:
    """Insert tests and vocabulary from a parsed JSON dict."""
    for t in data.get("tests", []):
        existing = (
            db.query(models.Test)
            .filter_by(
                exam_type=t["exam_type"],
                level=t.get("level", 1),
                section=t["section"],
                title=t.get("title", ""),
            )
            .first()
        )
        if existing:
            test = existing
        else:
            test = models.Test(
                exam_type=t["exam_type"],
                level=t.get("level", 1),
                section=t["section"],
                title=t.get("title", ""),
            )
            db.add(test)
            db.commit()
            db.refresh(test)

        questions = [
            models.Question(
                test_id=test.id,
                prompt=q["prompt"],
                options_json=json.dumps(q.get("options", [])),
                answer_key=q["answer_key"],
                skill_code=q.get("skill_code", ""),
                audio_url=q.get("audio_url"),
            )
            for q in t.get("questions", [])
        ]
        db.add_all(questions)
        db.commit()
    for v in data.get("vocabulary", []):
        if db.query(models.Vocabulary).filter_by(word=v["word"]).first():
            continue
        db.add(
            models.Vocabulary(word=v["word"], definition=v.get("definition", ""))
        )
    db.commit()


def import_from_json(path: Path, db: Session) -> None:
    """Insert tests and vocabulary from a JSON file."""
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    _import(data, db)


def import_from_data(data: dict, db: Session) -> None:
    """Insert tests and vocabulary from an in-memory object."""
    _import(data, db)


def main() -> None:
    import argparse
    parser = argparse.ArgumentParser(description="Import exam and practice content")
    parser.add_argument("file", type=Path, help="Path to JSON content file")
    args = parser.parse_args()

    with SessionLocal() as db:
        import_from_json(args.file, db)
    print("Import complete")


if __name__ == "__main__":
    main()
