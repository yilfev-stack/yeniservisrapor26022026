from __future__ import annotations

from io import BytesIO
from pathlib import Path
from uuid import uuid4

import boto3
from botocore.client import Config
from PIL import Image

from .config import settings

BASE_DIR = Path(__file__).resolve().parents[2]
RUNTIME_DIR = BASE_DIR / 'runtime'
UPLOAD_DIR = RUNTIME_DIR / 'uploads'
EXPORT_DIR = BASE_DIR / 'exports'

for p in [RUNTIME_DIR, UPLOAD_DIR, EXPORT_DIR]:
    p.mkdir(parents=True, exist_ok=True)


def _s3_client():
    return boto3.client(
        's3',
        endpoint_url=f"http://{settings.minio_endpoint}",
        aws_access_key_id=settings.minio_access_key,
        aws_secret_access_key=settings.minio_secret_key,
        config=Config(signature_version='s3v4'),
        region_name='us-east-1',
    )


def _ensure_bucket(bucket: str):
    client = _s3_client()
    try:
        client.head_bucket(Bucket=bucket)
    except Exception:
        client.create_bucket(Bucket=bucket)


def upload_bytes_to_minio(bucket: str, key: str, data: bytes, content_type: str = 'application/octet-stream'):
    try:
        _ensure_bucket(bucket)
        client = _s3_client()
        client.put_object(Bucket=bucket, Key=key, Body=data, ContentType=content_type)
    except Exception:
        # Keep local runtime functional even if MinIO is unavailable.
        pass


def save_original_image(report_id: str, filename: str, data: bytes) -> tuple[str, Path]:
    ext = Path(filename).suffix.lower() or '.jpg'
    name = f"{uuid4().hex}{ext}"
    rel = Path(report_id) / 'original' / name
    dst = UPLOAD_DIR / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(data)
    return str(rel).replace('\\', '/'), dst


def build_thumbnail_and_optimized(original_path: Path, report_id: str, filename_hint: str, *, max_width: int = 2000, quality: int = 85):
    image = Image.open(original_path)
    if image.mode not in ('RGB', 'L'):
        image = image.convert('RGB')

    opt = image.copy()
    if opt.width > max_width:
        ratio = max_width / float(opt.width)
        opt = opt.resize((max_width, int(opt.height * ratio)))

    opt_name = f"{uuid4().hex}.jpg"
    opt_rel = Path(report_id) / 'optimized' / opt_name
    opt_path = UPLOAD_DIR / opt_rel
    opt_path.parent.mkdir(parents=True, exist_ok=True)
    opt.save(opt_path, format='JPEG', quality=quality, optimize=True)

    thumb = image.copy()
    thumb.thumbnail((480, 480))
    thumb_name = f"{uuid4().hex}.jpg"
    thumb_rel = Path(report_id) / 'thumb' / thumb_name
    thumb_path = UPLOAD_DIR / thumb_rel
    thumb_path.parent.mkdir(parents=True, exist_ok=True)
    thumb.save(thumb_path, format='JPEG', quality=75, optimize=True)

    return (
        str(opt_rel).replace('\\', '/'),
        opt_path,
        opt.width,
        opt.height,
        str(thumb_rel).replace('\\', '/'),
        thumb_path,
        thumb.width,
        thumb.height,
    )


def local_upload_url(rel_path: str) -> str:
    return f"/files/uploads/{rel_path}"


def local_export_url(filename: str) -> str:
    return f"/files/exports/{filename}"
