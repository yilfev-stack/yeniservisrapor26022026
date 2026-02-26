from fastapi import APIRouter

from app.db import collection
from app.schemas import BrandIn, ModelIn
from .common import normalize_doc, now, parse_id

router = APIRouter(prefix='/api', tags=['catalog'])


@router.get('/brands')
async def list_brands():
    return [normalize_doc(doc) async for doc in collection('brands').find().sort('name', 1)]


@router.post('/brands')
async def create_brand(payload: BrandIn):
    doc = payload.model_dump() | {'created_at': now(), 'updated_at': now()}
    inserted = await collection('brands').insert_one(doc)
    return {'id': str(inserted.inserted_id)}


@router.post('/brands/{brand_id}/models')
async def create_model(brand_id: str, payload: ModelIn):
    doc = payload.model_dump() | {'brand_id': brand_id, 'created_at': now(), 'updated_at': now()}
    inserted = await collection('models').insert_one(doc)
    return {'id': str(inserted.inserted_id)}


@router.get('/models/{model_id}')
async def get_model(model_id: str):
    return normalize_doc(await collection('models').find_one({'_id': parse_id(model_id)}))


@router.put('/models/{model_id}')
async def update_model(model_id: str, payload: ModelIn):
    await collection('models').update_one({'_id': parse_id(model_id)}, {'$set': payload.model_dump() | {'updated_at': now()}})
    return {'ok': True}


@router.delete('/models/{model_id}')
async def delete_model(model_id: str):
    await collection('models').delete_one({'_id': parse_id(model_id)})
    return {'ok': True}
