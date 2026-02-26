from fastapi import APIRouter

from app.db import collection
from app.schemas import TemplateIn
from .common import normalize_doc, now, parse_id

router = APIRouter(prefix='/api', tags=['templates'])


@router.get('/templates')
async def list_templates(template_type: str | None = None):
    query = {'type': template_type} if template_type else {}
    return [normalize_doc(doc) async for doc in collection('templates').find(query)]


@router.post('/templates')
async def create_template(payload: TemplateIn):
    doc = payload.model_dump() | {'created_at': now(), 'updated_at': now()}
    inserted = await collection('templates').insert_one(doc)
    return {'id': str(inserted.inserted_id)}


@router.put('/templates/{template_id}')
async def update_template(template_id: str, payload: TemplateIn):
    await collection('templates').update_one({'_id': parse_id(template_id)}, {'$set': payload.model_dump() | {'updated_at': now()}})
    return {'ok': True}


@router.delete('/templates/{template_id}')
async def delete_template(template_id: str):
    await collection('templates').delete_one({'_id': parse_id(template_id)})
    return {'ok': True}
