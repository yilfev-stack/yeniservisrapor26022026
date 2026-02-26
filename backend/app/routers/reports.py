from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.db import collection
from app.schemas import ReportIn
from .common import normalize_doc, now, parse_id

router = APIRouter(prefix='/api', tags=['reports'])

STATUS_FLOW = ['draft', 'pre_report', 'quotation_sent', 'awaiting_approval', 'approved', 'in_service', 'final_report', 'archived']


def _compose_final_text(snapshot: str, extension: str) -> str:
    snap = (snapshot or '').strip()
    ext = (extension or '').strip()
    return f"{snap} {ext}".strip() if ext else snap


def _normalize_actions(actions: list[dict]) -> list[dict]:
    normalized: list[dict] = []
    for item in actions:
        entry = dict(item)
        entry['final_text_tr'] = _compose_final_text(entry.get('snapshot_text_tr', ''), entry.get('manual_extension_tr', ''))
        entry['final_text_en'] = _compose_final_text(entry.get('snapshot_text_en', ''), entry.get('manual_extension_en', ''))
        normalized.append(entry)
    return normalized


def generate_report_no(ts: datetime):
    return f"SR-{ts.strftime('%y%m%d')}-{int(ts.timestamp()) % 1000:03d}"


def status_meta(current_status: str):
    idx = STATUS_FLOW.index(current_status) if current_status in STATUS_FLOW else 0
    return {'current_stage': current_status, 'next_allowed': STATUS_FLOW[idx + 1] if idx < len(STATUS_FLOW) - 1 else None, 'timeline': STATUS_FLOW}


@router.get('/reports')
async def list_reports(
    customer_id: str | None = None,
    contact_id: str | None = None,
    status: str | None = None,
    issuer_id: str | None = None,
    responsible_user: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    brand: str | None = None,
    model: str | None = None,
    serial_no: str | None = None,
    tag_no: str | None = None,
):
    query = {}
    if customer_id:
        query['customer_id'] = customer_id
    if contact_id:
        query['contact_id'] = contact_id
    if status:
        query['status'] = status
    if issuer_id:
        query['issuer_id'] = issuer_id
    if responsible_user:
        query['responsible_user'] = responsible_user
    if date_from or date_to:
        query['created_at'] = {}
        if date_from:
            query['created_at']['$gte'] = datetime.fromisoformat(date_from)
        if date_to:
            query['created_at']['$lte'] = datetime.fromisoformat(date_to)
    if brand:
        query['products.snapshot_fields.brand'] = {'$regex': brand, '$options': 'i'}
    if model:
        query['products.snapshot_fields.model'] = {'$regex': model, '$options': 'i'}
    if serial_no:
        query['products.snapshot_fields.serial_no'] = {'$regex': serial_no, '$options': 'i'}
    if tag_no:
        query['products.snapshot_fields.tag_no'] = {'$regex': tag_no, '$options': 'i'}

    items = []
    async for doc in collection('reports').find(query).sort('created_at', -1):
        doc['status_meta'] = status_meta(doc.get('status', 'draft'))
        doc['actions'] = _normalize_actions(doc.get('actions', []))
        items.append(normalize_doc(doc))
    return items


@router.post('/reports')
async def create_report(payload: ReportIn):
    ts = now()
    values = payload.model_dump()
    values['actions'] = _normalize_actions(values.get('actions', []))
    doc = values | {
        'report_no': generate_report_no(ts),
        'exports': {},
        'photo_sets': {'before': [], 'after': []},
        'audit_log': [{'ts': ts, 'user': payload.responsible_user, 'action': 'create', 'diff_summary': 'initial draft'}],
        'created_at': ts,
        'updated_at': ts,
        'created_by': payload.responsible_user,
        'updated_by': payload.responsible_user,
    }
    inserted = await collection('reports').insert_one(doc)
    return {'id': str(inserted.inserted_id), 'report_no': doc['report_no'], 'status_meta': status_meta(doc['status'])}


@router.get('/reports/{report_id}')
async def get_report(report_id: str):
    doc = await collection('reports').find_one({'_id': parse_id(report_id)})
    if not doc:
        raise HTTPException(status_code=404, detail='Report not found')
    doc['status_meta'] = status_meta(doc.get('status', 'draft'))
    doc['actions'] = _normalize_actions(doc.get('actions', []))
    return normalize_doc(doc)


@router.put('/reports/{report_id}')
async def update_report(report_id: str, payload: ReportIn):
    base = payload.model_dump()
    base['actions'] = _normalize_actions(base.get('actions', []))
    values = base | {'updated_at': now(), 'updated_by': payload.responsible_user}
    await collection('reports').update_one({'_id': parse_id(report_id)}, {'$set': values})
    return {'ok': True}


@router.delete('/reports/{report_id}')
async def delete_report(report_id: str):
    await collection('reports').delete_one({'_id': parse_id(report_id)})
    return {'ok': True}


@router.post('/reports/{report_id}/status')
async def transition_status(report_id: str, status: str, user: str = 'system'):
    if status not in STATUS_FLOW:
        raise HTTPException(status_code=400, detail='Invalid status')
    report = await collection('reports').find_one({'_id': parse_id(report_id)})
    if not report:
        raise HTTPException(status_code=404, detail='Report not found')
    has_actions = bool(report.get('actions') or report.get('blocks', {}).get('actions'))
    if status == 'final_report' and (not has_actions or not report.get('photo_sets', {}).get('after')):
        raise HTTPException(status_code=400, detail='Final report requires actions and after photos')

    current = report.get('status', 'draft')
    current_idx = STATUS_FLOW.index(current) if current in STATUS_FLOW else 0
    target_idx = STATUS_FLOW.index(status)
    if target_idx > current_idx + 1:
        raise HTTPException(status_code=400, detail='Can only move to next stage')

    await collection('reports').update_one(
        {'_id': report['_id']},
        {
            '$set': {'status': status, 'updated_at': now(), 'updated_by': user},
            '$push': {'audit_log': {'ts': now(), 'user': user, 'action': 'status_change', 'diff_summary': f'{current}->{status}'}},
        },
    )
    return {'ok': True, 'status_meta': status_meta(status)}


@router.post('/reports/{report_id}/revision')
async def create_revision(report_id: str):
    report = await collection('reports').find_one({'_id': parse_id(report_id)})
    if not report:
        raise HTTPException(status_code=404, detail='Report not found')
    report.pop('_id')
    report['revision_no'] = report.get('revision_no', 1) + 1
    report['created_at'] = now()
    report['updated_at'] = now()
    report['status'] = 'draft'
    inserted = await collection('reports').insert_one(report)
    return {'id': str(inserted.inserted_id), 'revision_no': report['revision_no']}


@router.post('/reports/{report_id}/duplicate')
async def duplicate_report(report_id: str):
    report = await collection('reports').find_one({'_id': parse_id(report_id)})
    if not report:
        raise HTTPException(status_code=404, detail='Report not found')
    ts = now()
    report.pop('_id')
    report['report_no'] = generate_report_no(ts)
    report['revision_no'] = 1
    report['status'] = 'draft'
    report['photo_sets'] = {'before': [], 'after': []}
    report['created_at'] = ts
    report['updated_at'] = ts
    inserted = await collection('reports').insert_one(report)
    return {'id': str(inserted.inserted_id), 'report_no': report['report_no'], 'revision_no': 1}


@router.get('/products/{product_id}/service-history')
async def service_history(product_id: str, limit: int = 10):
    items = []
    async for doc in collection('reports').find({'products.product_id': product_id}).sort('created_at', -1).limit(limit):
        items.append({
            'id': str(doc['_id']),
            'report_no': doc.get('report_no'),
            'date': doc.get('created_at'),
            'status': doc.get('status'),
            'summary': doc.get('result_notes') or (doc.get('blocks', {}).get('actions', [{}])[0].get('text') if doc.get('blocks', {}).get('actions') else ''),
        })

    total = await collection('reports').count_documents({'products.product_id': product_id})
    latest = items[0]['date'] if items else None
    return {'product_id': product_id, 'total_reports': total, 'last_service_date': latest, 'reports': items}


@router.get('/dashboard/kpis')
async def dashboard_kpis():
    open_reports = await collection('reports').count_documents({'status': {'$nin': ['final_report', 'archived']}})
    final_reports = await collection('reports').count_documents({'status': 'final_report'})
    awaiting = await collection('reports').count_documents({'status': 'awaiting_approval'})
    customers = await collection('customers').count_documents({})
    products = await collection('products').count_documents({})
    templates = await collection('templates').count_documents({})
    return {
        'open_reports': open_reports,
        'final_reports': final_reports,
        'awaiting_approval': awaiting,
        'customers': customers,
        'products': products,
        'templates': templates,
    }



@router.get('/issuers/{issuer_id}/reports')
async def list_issuer_reports(
    issuer_id: str,
    customer_id: str | None = None,
    contact_id: str | None = None,
    status: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    brand: str | None = None,
    model: str | None = None,
    serial_no: str | None = None,
    tag_no: str | None = None,
):
    return await list_reports(
        customer_id=customer_id,
        contact_id=contact_id,
        status=status,
        issuer_id=issuer_id,
        responsible_user=None,
        date_from=date_from,
        date_to=date_to,
        brand=brand,
        model=model,
        serial_no=serial_no,
        tag_no=tag_no,
    )
