from datetime import datetime, timezone

from pymongo import MongoClient

from app.action_library_seed import SEED_ACTIONS

client = MongoClient('mongodb://mongodb:27017')
db = client['demart']

now = datetime.now(timezone.utc)

# Reset seedable collections for deterministic demo
for c in ['customers', 'customer_contacts', 'brands', 'models', 'products', 'reports', 'company_profiles', 'action_library', 'templates', 'exports', 'photos']:
    db[c].delete_many({})

issuer_id = db.company_profiles.insert_one(
    {
        'name': 'DEMART',
        'legal_company_name': 'Demart Mühendislik Sanayi Tic. Ltd. Şti.',
        'address': 'İstanbul, Türkiye',
        'phone': '+90 000 000 00 00',
        'email': 'info@demart.example',
        'legal_notes': ['Garanti şartları raporda belirtilmiştir.'],
        'signature_labels': {'responsible': 'Sorumlu', 'last_check': 'Son Kontrol'},
        'is_default': True,
        'created_at': now,
        'updated_at': now,
    }
).inserted_id

customer_id = db.customers.insert_one(
    {'name': 'Demo Enerji', 'city': 'Istanbul', 'country': 'TR', 'created_at': now, 'updated_at': now}
).inserted_id
contact_id = db.customer_contacts.insert_one(
    {'customer_id': str(customer_id), 'name': 'Ahmet Yılmaz', 'email': 'ahmet@example.com', 'phone': '+90 555 000 0000', 'created_at': now, 'updated_at': now}
).inserted_id
brand_id = db.brands.insert_one({'name': 'Fisher', 'created_at': now, 'updated_at': now}).inserted_id
model_id = db.models.insert_one({'brand_id': str(brand_id), 'name': 'DVC6200', 'created_at': now, 'updated_at': now}).inserted_id
product_id = db.products.insert_one(
    {
        'customer_id': str(customer_id),
        'brand_id': str(brand_id),
        'model_id': str(model_id),
        'type': 'Control Valve',
        'valve_type': 'control',
        'manufacturer': 'Fisher',
        'serial_no': 'SN-001',
        'tag_no': 'TAG-100',
        'size': 'DN25',
        'pressure_class': 'PN40',
        'body_material': 'WCB',
        'trim_material': 'SS316',
        'seat_material': 'PTFE',
        'stem_material': 'SS316',
        'actuator': {
            'type': 'pneumatic_diaphragm',
            'brand': 'Fisher',
            'model': 'DVC6200',
            'serial_no': 'SN-001-A',
            'action': 'air_to_open',
            'model_same_as_valve': False,
            'serial_same_as_valve': False,
        },
        'accessories': [
            {'key': 'positioner', 'installed': True, 'brand': 'Fisher', 'model': 'DVC6200', 'serial_no': 'POS-01'},
            {'key': 'solenoid', 'installed': True, 'brand': 'ASCO', 'model': 'S8210', 'serial_no': 'SOL-02'},
        ],
        'created_at': now,
        'updated_at': now,
    }
).inserted_id

for idx, (scope, category, tr, en) in enumerate(SEED_ACTIONS, start=1):
    db.action_library.insert_one(
        {
            'scope': scope,
            'category': category,
            'order_index': idx,
            'title_tr': tr,
            'title_en': en,
            'text_tr': tr,
            'text_en': en,
            'is_active': True,
            'created_by_user': 'seed',
            'created_at': now,
            'updated_at': now,
        }
    )

# also keep legacy templates collection for compatibility
for doc in db.action_library.find({'scope': {'$in': ['valve', 'positioner']}}).limit(6):
    db.templates.insert_one({'type': 'action', 'title': doc['title_tr'][:40], 'language': 'both', 'text': doc['text_tr'], 'created_at': now, 'updated_at': now})

for status in ['draft', 'pre_report', 'final_report']:
    db.reports.insert_one(
        {
            'report_no': f'SR-260226-{status[:2]}',
            'language': 'tr',
            'status': status,
            'revision_no': 1,
            'customer_id': str(customer_id),
            'issuer_id': str(issuer_id),
            'contact_id': str(contact_id),
            'responsible_user': 'Demo Tech',
            'products': [{'product_id': str(product_id), 'snapshot_fields': {'brand': 'Fisher', 'model': 'DVC6200', 'serial_no': 'SN-001', 'tag_no': 'TAG-100'}}],
            'blocks': {'complaint': [{'text': 'Kontrol dengesiz.'}], 'problems': [{'text': 'Seat yüzeyi aşınmış.'}]},
            'actions': [{'library_id': None, 'snapshot_text_tr': 'Seat laplama uygulandı.', 'snapshot_text_en': 'Seat lapping applied.', 'manual_extension_tr': 'Ek testler yapıldı.', 'manual_extension_en': 'Additional tests completed.', 'final_text_tr': 'Seat laplama uygulandı. Ek testler yapıldı.', 'final_text_en': 'Seat lapping applied. Additional tests completed.'}],
            'accessory_notes': [{'accessory_key': 'positioner', 'finding': 'Kalibrasyon kaymış', 'action_text': 'Zero/span ayarlandı', 'measurement': {'value': 4.0, 'unit': 'mA'}}],
            'photo_sets': {'before': [], 'after': ['demo'] if status == 'final_report' else []},
            'created_at': now,
            'updated_at': now,
        }
    )
print('Seed completed with action_library + issuer + demo reports')
