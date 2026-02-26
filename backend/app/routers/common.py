from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException


def now():
    return datetime.now(tz=timezone.utc)


def parse_id(raw_id: str) -> ObjectId:
    if not ObjectId.is_valid(raw_id):
        raise HTTPException(status_code=400, detail='Invalid id')
    return ObjectId(raw_id)


def normalize_doc(doc: dict | None):
    if not doc:
        return None
    doc['id'] = str(doc.pop('_id'))
    return doc
