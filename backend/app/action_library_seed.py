from __future__ import annotations

from datetime import datetime, timezone

from .db import collection


SEED_ACTIONS: list[tuple[str, str, str, str]] = [
    (
        'valve',
        'overhaul',
        'Vana komple demonte edilerek tüm iç trim bileşenleri ayrıştırıldı.',
        'The valve was completely disassembled and all internal trim components were separated.',
    ),
    (
        'valve',
        'overhaul',
        'Gövde iç yüzeyleri korozyon/erozyon açısından incelendi.',
        'The internal body surfaces were inspected for corrosion and erosion.',
    ),
    (
        'valve',
        'overhaul',
        'Seat–plug sızdırmazlık yüzeylerinde laplama işlemi uygulandı.',
        'Lapping was performed on the seat-to-plug sealing surfaces.',
    ),
    ('valve', 'overhaul', 'Salmastra seti yenilendi.', 'The packing set was replaced.'),
    ('valve', 'overhaul', 'Gövde contası yenilendi.', 'The body gasket was replaced.'),
    (
        'valve',
        'overhaul',
        'O-ring ve sızdırmazlık elemanları değiştirildi.',
        'All O-rings and sealing elements were replaced.',
    ),
    ('valve', 'overhaul', 'Kumlama işlemi uygulandı.', 'Abrasive blasting was carried out.'),
    (
        'valve',
        'overhaul',
        'Yüzey hazırlığı sonrası astar ve son kat boya uygulandı.',
        'Following surface preparation, primer and finish coats were applied.',
    ),
    ('valve', 'overhaul', 'Vana yeniden monte edildi.', 'The valve was reassembled.'),
    ('valve', 'overhaul', 'Sızdırmazlık testi gerçekleştirildi.', 'A leak-tightness test was performed.'),
    ('valve', 'overhaul', 'Fonksiyonel strok testi yapıldı.', 'A functional stroke test was completed.'),
    (
        'valve',
        'overhaul',
        'Nihai görsel kontrol yapılarak sevke hazırlandı.',
        'Final visual inspection was completed and the unit was prepared for dispatch.',
    ),
    ('actuator_pneumatic', 'service', 'Aktüatör demonte edildi.', 'The actuator was disassembled.'),
    (
        'actuator_pneumatic',
        'service',
        'Diyafram kontrol edildi/değiştirildi.',
        'The diaphragm was inspected and replaced when required.',
    ),
    (
        'actuator_pneumatic',
        'service',
        'Keçeler ve O-ringler yenilendi.',
        'Seals and O-rings were renewed.',
    ),
    (
        'actuator_pneumatic',
        'service',
        'Bench set ayarı yapıldı.',
        'Bench set adjustment was performed.',
    ),
    (
        'actuator_pneumatic',
        'service',
        'Hava kaçak testi gerçekleştirildi.',
        'A pneumatic leak test was performed.',
    ),
    ('actuator_pneumatic', 'service', 'Fonksiyon testi yapıldı.', 'A functional test was performed.'),
    ('actuator_electric', 'service', 'İç temizlik yapıldı.', 'Internal cleaning was carried out.'),
    ('actuator_electric', 'service', 'Dişli kutusu kontrol edildi.', 'The gearbox was inspected.'),
    ('actuator_electric', 'service', 'Gres yenilendi.', 'Grease was renewed.'),
    (
        'actuator_electric',
        'service',
        'Limit switch ayarları kontrol edildi.',
        'Limit switch settings were checked.',
    ),
    (
        'actuator_electric',
        'service',
        'Elektriksel fonksiyon testi yapıldı.',
        'Electrical functional testing was performed.',
    ),
    (
        'positioner',
        'calibration',
        'Pozisyoner demonte edilerek temizlendi.',
        'The positioner was disassembled and cleaned.',
    ),
    (
        'positioner',
        'calibration',
        'Nozzle–flapper mekanizması kontrol edildi.',
        'The nozzle-flapper mechanism was checked.',
    ),
    (
        'positioner',
        'calibration',
        'Zero/span kalibrasyonu yapıldı.',
        'Zero/span calibration was performed.',
    ),
    (
        'positioner',
        'calibration',
        'Sinyal–pozisyon doğrulaması gerçekleştirildi.',
        'Signal-to-position verification was completed.',
    ),
    ('positioner', 'calibration', 'Stroking testi yapıldı.', 'A stroking test was performed.'),
    (
        'accessory',
        'checklist',
        'Solenoid kontrol edildi/değiştirildi.',
        'The solenoid was inspected and replaced when required.',
    ),
    ('accessory', 'checklist', 'Limit switch ayarlandı.', 'The limit switch was adjusted.'),
    ('accessory', 'checklist', 'AFR filtre değiştirildi.', 'The AFR filter was replaced.'),
    ('accessory', 'checklist', 'I/P converter kontrol edildi.', 'The I/P converter was checked.'),
]


async def ensure_action_library_seed() -> int:
    """Ensure mandatory Action Library seed items exist (idempotent)."""
    lib = collection('action_library')
    now = datetime.now(timezone.utc)
    created_count = 0

    for idx, (scope, category, tr, en) in enumerate(SEED_ACTIONS, start=1):
        existing = await lib.find_one({'scope': scope, 'text_tr': tr})
        if existing:
            continue

        await lib.insert_one(
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
        created_count += 1

    return created_count
