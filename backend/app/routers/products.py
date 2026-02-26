from fastapi import APIRouter

from app.db import collection
from app.schemas import ProductIn
from .common import normalize_doc, now, parse_id

router = APIRouter(prefix='/api', tags=['products'])


@router.get('/products')
async def list_products(customer_id: str | None = None, brand_id: str | None = None, model_id: str | None = None):
    query = {}
    if customer_id:
        query['customer_id'] = customer_id
    if brand_id:
        query['brand_id'] = brand_id
    if model_id:
        query['model_id'] = model_id
    return [normalize_doc(doc) async for doc in collection('products').find(query)]


@router.post('/products')
async def create_product(payload: ProductIn):
    doc = payload.model_dump() | {'created_at': now(), 'updated_at': now()}
    inserted = await collection('products').insert_one(doc)
    return {'id': str(inserted.inserted_id)}


@router.get('/products/{product_id}')
async def get_product(product_id: str):
    return normalize_doc(await collection('products').find_one({'_id': parse_id(product_id)}))


@router.put('/products/{product_id}')
async def update_product(product_id: str, payload: ProductIn):
    await collection('products').update_one({'_id': parse_id(product_id)}, {'$set': payload.model_dump() | {'updated_at': now()}})
    return {'ok': True}


@router.delete('/products/{product_id}')
async def delete_product(product_id: str):
    await collection('products').delete_one({'_id': parse_id(product_id)})
    return {'ok': True}
