from fastapi import APIRouter

from app.db import collection
from app.schemas import ActionLibraryIn
from .common import normalize_doc, now, parse_id

router = APIRouter(prefix='/api', tags=['action-library'])


@router.get('/action-library')
async def list_action_library(scope: str | None = None, valve_type: str | None = None, include_inactive: bool = False):
    query: dict = {}
    if scope:
        query['scope'] = scope
    if valve_type:
        query['$or'] = [{'valve_type': valve_type}, {'valve_type': None}, {'valve_type': ''}]
    if not include_inactive:
        query['is_active'] = True
    return [normalize_doc(doc) async for doc in collection('action_library').find(query).sort([('scope', 1), ('order_index', 1)])]


@router.post('/action-library')
async def create_action_library(payload: ActionLibraryIn):
    doc = payload.model_dump() | {'created_at': now(), 'updated_at': now(), 'deleted_at': None}
    inserted = await collection('action_library').insert_one(doc)
    return {'id': str(inserted.inserted_id)}


@router.put('/action-library/{item_id}')
async def update_action_library(item_id: str, payload: ActionLibraryIn):
    await collection('action_library').update_one({'_id': parse_id(item_id)}, {'$set': payload.model_dump() | {'updated_at': now()}})
    return {'ok': True}


@router.post('/action-library/reorder')
async def reorder_action_library(items: list[dict]):
    for item in items:
        if item.get('id') and item.get('order_index') is not None:
            await collection('action_library').update_one({'_id': parse_id(item['id'])}, {'$set': {'order_index': int(item['order_index']), 'updated_at': now()}})
    return {'ok': True}


@router.delete('/action-library/{item_id}')
async def delete_action_library(item_id: str):
    await collection('action_library').update_one({'_id': parse_id(item_id)}, {'$set': {'is_active': False, 'deleted_at': now(), 'updated_at': now()}})
    return {'ok': True}
