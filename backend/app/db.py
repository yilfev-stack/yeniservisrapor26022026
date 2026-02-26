from motor.motor_asyncio import AsyncIOMotorClient

from .config import settings


client = AsyncIOMotorClient(settings.mongodb_uri)
db = client[settings.mongodb_db]


def collection(name: str):
    return db[name]
