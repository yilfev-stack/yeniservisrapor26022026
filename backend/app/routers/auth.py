from fastapi import APIRouter, HTTPException

from app.db import collection

router = APIRouter(prefix='/api/auth', tags=['auth'])


@router.post('/login')
async def login(email: str, password: str):
    user = await collection('users').find_one({'email': email})
    if not user:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    return {'access_token': 'dev-token', 'token_type': 'bearer', 'user': {'name': user['name'], 'role': user['role']}}


@router.get('/me')
async def me():
    return {'name': 'Demo User', 'role': 'admin'}
