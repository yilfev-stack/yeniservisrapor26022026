from fastapi import APIRouter, HTTPException

from app.db import collection
from app.schemas import ContactIn, CustomerIn
from .common import normalize_doc, now, parse_id

router = APIRouter(prefix='/api', tags=['customers'])


@router.get('/customers')
async def list_customers():
    items = [normalize_doc(doc) async for doc in collection('customers').find().sort('created_at', -1)]
    return items


@router.post('/customers')
async def create_customer(payload: CustomerIn):
    doc = payload.model_dump() | {'created_at': now(), 'updated_at': now()}
    inserted = await collection('customers').insert_one(doc)
    return {'id': str(inserted.inserted_id)}


@router.get('/customers/{customer_id}')
async def get_customer(customer_id: str):
    doc = await collection('customers').find_one({'_id': parse_id(customer_id)})
    if not doc:
        raise HTTPException(status_code=404, detail='Customer not found')
    return normalize_doc(doc)


@router.put('/customers/{customer_id}')
async def update_customer(customer_id: str, payload: CustomerIn):
    await collection('customers').update_one({'_id': parse_id(customer_id)}, {'$set': payload.model_dump() | {'updated_at': now()}})
    return {'ok': True}


@router.delete('/customers/{customer_id}')
async def delete_customer(customer_id: str):
    await collection('customers').delete_one({'_id': parse_id(customer_id)})
    return {'ok': True}


@router.get('/customers/{customer_id}/contacts')
async def list_contacts(customer_id: str):
    items = [normalize_doc(doc) async for doc in collection('customer_contacts').find({'customer_id': customer_id})]
    return items


@router.post('/customers/{customer_id}/contacts')
async def create_contact(customer_id: str, payload: ContactIn):
    doc = payload.model_dump() | {'customer_id': customer_id, 'created_at': now(), 'updated_at': now()}
    inserted = await collection('customer_contacts').insert_one(doc)
    return {'id': str(inserted.inserted_id)}


@router.put('/contacts/{contact_id}')
async def update_contact(contact_id: str, payload: ContactIn):
    await collection('customer_contacts').update_one({'_id': parse_id(contact_id)}, {'$set': payload.model_dump() | {'updated_at': now()}})
    return {'ok': True}


@router.delete('/contacts/{contact_id}')
async def delete_contact(contact_id: str):
    await collection('customer_contacts').delete_one({'_id': parse_id(contact_id)})
    return {'ok': True}
