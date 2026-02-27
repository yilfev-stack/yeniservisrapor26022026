from fastapi import APIRouter, HTTPException

from app.db import collection
from app.schemas import ProductIn, ProductOptionUpdateIn, ProductOptionValueIn
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


DEFAULT_PRODUCT_OPTIONS = {
    'type': [],
    'valve_type': ['control', 'on_off', 'safety', 'other'],
    'size': [],
    'pressure_class': [],
    'connection_type': [],
    'body_style': [],
    'fail_action': [],
    'body_material': [],
    'trim_material': [],
    'seat_material': [],
    'stem_material': [],
    'actuator_type': ['pneumatic_diaphragm', 'pneumatic_piston', 'electric', 'hydraulic', 'other'],
    'actuator_brand': [],
    'actuator_model': [],
    'actuator_action': [],
    'accessory_key': ['positioner', 'solenoid', 'limit_switch', 'afr', 'booster', 'ip_converter', 'other'],
    'accessory_brand': [],
    'accessory_model': [],
}


def _normalize_option_value(value: str) -> str:
    return value.strip()


@router.get('/product-options')
async def get_product_options():
    doc = await collection('settings').find_one({'key': 'product_options'})
    values = doc.get('values', {}) if doc else {}
    merged = {}
    for key, defaults in DEFAULT_PRODUCT_OPTIONS.items():
        merged[key] = sorted(set(defaults + [str(v) for v in values.get(key, []) if str(v).strip()]))
    for key, vals in values.items():
        if key not in merged:
            merged[key] = sorted(set([str(v) for v in vals if str(v).strip()]))
    return merged


@router.post('/product-options/{field}/values')
async def add_product_option_value(field: str, payload: ProductOptionValueIn):
    if field not in DEFAULT_PRODUCT_OPTIONS:
        raise HTTPException(status_code=400, detail='Unsupported option field')
    value = _normalize_option_value(payload.value)
    if not value:
        raise HTTPException(status_code=400, detail='Value cannot be empty')
    await collection('settings').update_one(
        {'key': 'product_options'},
        {
            '$setOnInsert': {'key': 'product_options', 'created_at': now()},
            '$addToSet': {f'values.{field}': value},
            '$set': {'updated_at': now()},
        },
        upsert=True,
    )
    return {'ok': True, 'field': field, 'value': value}


@router.put('/product-options/{field}/values')
async def update_product_option_value(field: str, payload: ProductOptionUpdateIn):
    if field not in DEFAULT_PRODUCT_OPTIONS:
        raise HTTPException(status_code=400, detail='Unsupported option field')
    old_value = _normalize_option_value(payload.old_value)
    new_value = _normalize_option_value(payload.new_value)
    if not old_value or not new_value:
        raise HTTPException(status_code=400, detail='Values cannot be empty')
    await collection('settings').update_one(
        {'key': 'product_options'},
        {
            '$setOnInsert': {'key': 'product_options', 'created_at': now()},
            '$pull': {f'values.{field}': old_value},
            '$addToSet': {f'values.{field}': new_value},
            '$set': {'updated_at': now()},
        },
        upsert=True,
    )
    return {'ok': True, 'field': field, 'old_value': old_value, 'new_value': new_value}


@router.delete('/product-options/{field}/values')
async def delete_product_option_value(field: str, value: str):
    if field not in DEFAULT_PRODUCT_OPTIONS:
        raise HTTPException(status_code=400, detail='Unsupported option field')
    normalized = _normalize_option_value(value)
    if not normalized:
        raise HTTPException(status_code=400, detail='Value cannot be empty')
    await collection('settings').update_one(
        {'key': 'product_options'},
        {'$pull': {f'values.{field}': normalized}, '$set': {'updated_at': now()}},
        upsert=True,
    )
    return {'ok': True, 'field': field, 'value': normalized}
