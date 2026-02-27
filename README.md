# DEMART Servis Raporu Yönetim Sistemi (V2)

Docker tabanlı FastAPI + React + MongoDB + MinIO + Redis.

## Kurulum
```bash
docker compose up -d --build
```

## URL'ler
- Frontend: http://localhost:3020
- Backend Docs: http://localhost:8000/docs
- MinIO Console: http://localhost:9001

## Seed (demo data + action library + issuer)
```bash
docker compose exec backend python scripts/seed.py
```

Not: Action Library için zorunlu TR/EN başlangıç maddeleri backend açılışında otomatik olarak kontrol edilir ve eksik olanlar tamamlanır.

## Neler eklendi
- Action Library CRUD (`/api/action-library`) + TR/EN seed maddeleri.
- Issuer/Company Profiles CRUD + logo upload (`/api/settings/company-profiles`).
- Report API issuer filtresi + issuer bazlı report listeleme (`/api/issuers/{issuer_id}/reports`).
- Gerçek foto pipeline (original + thumb + optimized).
- Gerçek PDF ve Excel üretimi (stub değil).

## Örnek API çağrıları
### Action library list
```bash
curl "http://localhost:8000/api/action-library?scope=valve"
```

### Company profile oluştur
```bash
curl -X POST "http://localhost:8000/api/settings/company-profiles" \
  -H "Content-Type: application/json" \
  -d '{"name":"Supplier Profile","legal_company_name":"Supplier Ltd.","address":"İstanbul","email":"supplier@example.com"}'
```

### Logo yükle
```bash
curl -X POST "http://localhost:8000/api/settings/company-profiles/{PROFILE_ID}/logo" \
  -F "file=@demart-logo.png"
```

### PDF üret
```bash
curl -X POST "http://localhost:8000/api/reports/{REPORT_ID}/export/pdf" \
  -H "Content-Type: application/json" \
  -d '{"photos_per_page":6,"quality":"standard","language":"tr"}'
```

### Excel üret (external/internal)
```bash
curl -X POST "http://localhost:8000/api/reports/{REPORT_ID}/export/excel" \
  -H "Content-Type: application/json" \
  -d '{"type":"external","language":"tr"}'

curl -X POST "http://localhost:8000/api/reports/{REPORT_ID}/export/excel" \
  -H "Content-Type: application/json" \
  -d '{"type":"internal","language":"en"}'
```

## Doğrulama örnek export dosyaları
`exports/` klasörü çalışma zamanında üretilen dosyalar içindir ve Git'e binary dosya commit edilmez.
Aşağıdaki çağrılarla dosyaları lokalde üretip doğrulayın:
- PDF: `POST /api/reports/{REPORT_ID}/export/pdf`
- Excel (external): `POST /api/reports/{REPORT_ID}/export/excel` `{"type":"external"}`
- Excel (internal): `POST /api/reports/{REPORT_ID}/export/excel` `{"type":"internal"}`


## Sorun giderme
- Backend açılmıyor ve logda `gobject-2.0-0` hatası görüyorsanız image eski olabilir. Yeniden build edin:
```bash
docker compose down --remove-orphans
docker compose build --no-cache backend
docker compose up -d
docker compose logs backend --tail=200
```
- Frontend portu artık **3020**. 5173 görüyorsanız eski container çalışıyordur; `docker compose down --remove-orphans` sonrası tekrar `up -d --build` yapın.
