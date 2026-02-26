from fastapi import APIRouter, UploadFile

from app.db import collection
from app.schemas import CompanyProfileIn
from app.storage import upload_bytes_to_minio
from .common import normalize_doc, now, parse_id

router = APIRouter(prefix='/api/settings', tags=['settings'])


@router.get('/company-profiles')
async def list_company_profiles():
    return [normalize_doc(doc) async for doc in collection('company_profiles').find().sort('created_at', -1)]


@router.post('/company-profiles')
async def create_company_profile(payload: CompanyProfileIn):
    if payload.is_default:
        await collection('company_profiles').update_many({}, {'$set': {'is_default': False}})
    doc = payload.model_dump() | {'created_at': now(), 'updated_at': now()}
    inserted = await collection('company_profiles').insert_one(doc)
    return {'id': str(inserted.inserted_id)}


@router.put('/company-profiles/{profile_id}')
async def update_company_profile(profile_id: str, payload: CompanyProfileIn):
    if payload.is_default:
        await collection('company_profiles').update_many({}, {'$set': {'is_default': False}})
    await collection('company_profiles').update_one({'_id': parse_id(profile_id)}, {'$set': payload.model_dump() | {'updated_at': now()}})
    return {'ok': True}


@router.delete('/company-profiles/{profile_id}')
async def delete_company_profile(profile_id: str):
    await collection('company_profiles').delete_one({'_id': parse_id(profile_id)})
    return {'ok': True}


@router.post('/company-profiles/{profile_id}/logo')
async def upload_logo(profile_id: str, file: UploadFile):
    content = await file.read()
    key = f'logos/{profile_id}/{file.filename}'
    upload_bytes_to_minio('demart-assets', key, content, file.content_type or 'image/png')
    await collection('company_profiles').update_one(
        {'_id': parse_id(profile_id)}, {'$set': {'logo_object_key': key, 'updated_at': now()}}
    )
    return {'ok': True, 'logo_object_key': key}



@router.get('/issuers')
async def list_issuers():
    return await list_company_profiles()
