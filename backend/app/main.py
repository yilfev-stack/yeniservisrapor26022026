from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .routers import action_library, auth, catalog, customers, media, products, reports, settings as settings_router, templates

Path('runtime/uploads').mkdir(parents=True, exist_ok=True)
Path('exports').mkdir(parents=True, exist_ok=True)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
async def health():
    return {'status': 'ok'}


app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(catalog.router)
app.include_router(products.router)
app.include_router(reports.router)
app.include_router(templates.router)
app.include_router(action_library.router)
app.include_router(media.router)
app.include_router(settings_router.router)

app.mount('/files/uploads', StaticFiles(directory='runtime/uploads'), name='uploads')
app.mount('/files/exports', StaticFiles(directory='exports'), name='exports')
