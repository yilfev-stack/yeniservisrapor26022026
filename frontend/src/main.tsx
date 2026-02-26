import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookText, Building2, FileSpreadsheet, FileText, Home, Package, Plus, Settings, Users, Wrench } from 'lucide-react'
import { Toaster } from 'sonner'

import './index.css'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { DialogContent, DialogRoot } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'

type Lang = 'tr' | 'en'
type Dict = Record<string, { tr: string; en: string }>

type ProductRow = { id: string; type?: string; tag_no?: string; valve_type?: string }
type ReportActionRow = {
  library_id?: string
  snapshot_text_tr: string
  snapshot_text_en: string
  manual_extension_tr: string
  manual_extension_en: string
  final_text_tr?: string
  final_text_en?: string
  order_index: number
}

const dict: Dict = {
  dashboard: { tr: 'Dashboard', en: 'Dashboard' },
  customers: { tr: 'Müşteriler', en: 'Customers' },
  products: { tr: 'Ürünler', en: 'Products' },
  reports: { tr: 'Raporlar', en: 'Reports' },
  templates: { tr: 'İşlem Kütüphanesi', en: 'Action Library' },
  issuers: { tr: 'Bayiler', en: 'Issuers' },
  exports: { tr: 'Dışa Aktarımlar', en: 'Exports' },
  settings: { tr: 'Ayarlar', en: 'Settings' },
  newReport: { tr: 'Yeni Rapor', en: 'New Report' },
  language: { tr: 'Dil', en: 'Language' },
  save: { tr: 'Kaydet', en: 'Save' },
  create: { tr: 'Oluştur', en: 'Create' },
  filter: { tr: 'Filtrele', en: 'Filter' },
  wizardStep: { tr: 'Adım', en: 'Step' },
  general: { tr: 'Genel', en: 'General' },
  product: { tr: 'Ürün', en: 'Product' },
  shipping: { tr: 'Sevkiyat', en: 'Shipping' },
  complaint: { tr: 'Şikayet', en: 'Complaint' },
  problems: { tr: 'Sorunlar', en: 'Problems' },
  actions: { tr: 'İşlemler', en: 'Actions' },
  spares: { tr: 'Yedek Parçalar', en: 'Spares' },
  photosResult: { tr: 'Fotoğraflar ve Sonuç', en: 'Photos & Result' },
  back: { tr: 'Geri', en: 'Back' },
  next: { tr: 'İleri', en: 'Next' },
  draftSaved: { tr: 'Taslak kaydedildi', en: 'Draft saved' },
  customerSelect: { tr: 'Müşteri seçin', en: 'Select customer' },
  productSelect: { tr: 'Ürün seçin', en: 'Select product' },
  valveType: { tr: 'Vana Tipi', en: 'Valve Type' },
  actionScopeFilter: { tr: 'Kapsam', en: 'Scope' },
  actionTitle: { tr: 'İşlem metni', en: 'Action text' },
  manualExtension: { tr: 'Manuel ek', en: 'Manual extension' },
  loadIssuerReports: { tr: 'Bayi raporlarını getir', en: 'Load issuer reports' },
  issuerId: { tr: 'Bayi', en: 'Issuer' },
  companyProfiles: { tr: 'Firma Profilleri', en: 'Company Profiles' },
  name: { tr: 'İsim', en: 'Name' },
  legalText: { tr: 'Yasal Metin', en: 'Legal Text' },
  address: { tr: 'Adres', en: 'Address' },
  phone: { tr: 'Telefon', en: 'Phone' },
  email: { tr: 'E-posta', en: 'Email' },
  empty: { tr: 'Kayıt yok', en: 'No records' },
}

const I18nContext = React.createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({ lang: 'tr', setLang: () => undefined, t: (k) => k })
const useI18n = () => React.useContext(I18nContext)

async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, ...init })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

function Shell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const { lang, setLang, t } = useI18n()
  const menu = [
    { to: '/dashboard', label: t('dashboard'), icon: <Home size={16} /> },
    { to: '/customers', label: t('customers'), icon: <Users size={16} /> },
    { to: '/products', label: t('products'), icon: <Package size={16} /> },
    { to: '/reports', label: t('reports'), icon: <FileText size={16} /> },
    { to: '/templates', label: t('templates'), icon: <BookText size={16} /> },
    { to: '/issuers', label: t('issuers'), icon: <Building2 size={16} /> },
    { to: '/exports', label: t('exports'), icon: <FileSpreadsheet size={16} /> },
    { to: '/settings', label: t('settings'), icon: <Settings size={16} /> },
  ]
  return (
    <div className='min-h-screen bg-[#f6f7f9] text-slate-900'>
      <Toaster richColors position='top-right' />
      <div className='mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 md:grid-cols-[230px_1fr]'>
        <aside className='border-r border-slate-200 bg-[#f8f8f8] p-4'>
          <div className='mb-6 flex items-center gap-2 px-2'><div className='rounded-lg bg-slate-900 p-1.5 text-white'><Wrench size={15} /></div><div><p className='text-sm font-semibold'>DEMART</p><p className='text-xs text-slate-500'>Valve Services</p></div></div>
          <nav className='space-y-1'>{menu.map((item) => <Link key={item.to} to={item.to} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${pathname.startsWith(item.to) ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-white/80'}`}>{item.icon}{item.label}</Link>)}</nav>
        </aside>
        <main className='p-6 md:p-8'>
          <header className='mb-6 flex items-center justify-between'>
            <Link to='/reports/new'><Button><Plus size={14} className='mr-1' />{t('newReport')}</Button></Link>
            <div className='flex items-center gap-2'><span className='text-sm text-slate-500'>{t('language')}</span><Button variant={lang === 'tr' ? 'default' : 'secondary'} className='h-9 px-3' onClick={() => setLang('tr')}>TR</Button><Button variant={lang === 'en' ? 'default' : 'secondary'} className='h-9 px-3' onClick={() => setLang('en')}>EN</Button></div>
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}

function DashboardPage() {
  const [kpi, setKpi] = React.useState<any>({})
  React.useEffect(() => { void api('/api/dashboard/kpis').then((v) => setKpi(v as any)).catch(() => setKpi({})) }, [])
  return <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 text-sm'>{JSON.stringify(kpi)}</section>
}

function SimpleCrudPage({ title, endpoint, fields }: { title: string; endpoint: string; fields: Array<{ key: string; label: string }> }) {
  const { t } = useI18n()
  const [items, setItems] = React.useState<any[]>([])
  const [form, setForm] = React.useState<Record<string, string>>({})
  const load = () => api<any[]>(endpoint).then(setItems).catch(() => setItems([]))
  React.useEffect(() => { void load() }, [endpoint])
  return <div className='grid gap-6 lg:grid-cols-[1fr_360px]'><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'><h1 className='mb-4 text-2xl font-semibold'>{title}</h1><div className='space-y-3'>{items.length ? items.map((it) => <div key={it.id} className='rounded-xl border border-slate-200 p-3 text-sm'>{JSON.stringify(it)}</div>) : <p className='text-sm text-slate-500'>{t('empty')}</p>}</div></section><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'><div className='space-y-3'>{fields.map((f) => <div key={f.key}><Label>{f.label}</Label><Input value={form[f.key] || ''} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} /></div>)}<Button onClick={async () => { await api(endpoint, { method: 'POST', body: JSON.stringify(form) }); setForm({}); load() }}>{t('save')}</Button></div></section></div>
}

function ActionLibraryPage() {
  const { t } = useI18n()
  const [valveType, setValveType] = React.useState('')
  const [items, setItems] = React.useState<any[]>([])
  const load = async () => setItems(await api<any[]>(`/api/action-library${valveType ? `?valve_type=${encodeURIComponent(valveType)}` : ''}`))
  React.useEffect(() => { void load().catch(() => setItems([])) }, [valveType])
  return <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 space-y-3'><Label>{t('valveType')}</Label><Input value={valveType} onChange={(e) => setValveType(e.target.value)} /><div className='space-y-2'>{items.map((i) => <div key={i.id} className='rounded-lg border border-slate-200 p-3 text-sm'>{i.scope} · {i.valve_type || '-'} · {i.title_tr}</div>)}</div></section>
}

function ReportsPage() {
  const { t } = useI18n()
  const [filters, setFilters] = React.useState<any>({ customer_id: '', contact_id: '', issuer_id: '', status: '', date_from: '', date_to: '', brand: '', model: '', serial_no: '', tag_no: '' })
  const [rows, setRows] = React.useState<any[]>([])
  const load = async () => {
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v).map(([k, v]) => [k, String(v)]))
    setRows(await api<any[]>(`/api/reports?${qs.toString()}`))
  }
  return <div className='space-y-6'><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'><h1 className='mb-4 text-2xl font-semibold'>{t('reports')}</h1><div className='grid gap-3 md:grid-cols-3'>{Object.keys(filters).map((k) => <Input key={k} placeholder={k} value={filters[k]} onChange={(e) => setFilters((p: any) => ({ ...p, [k]: e.target.value }))} />)}</div><Button className='mt-3' onClick={() => { void load() }}>{t('filter')}</Button></section><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'>{rows.map((r) => <div key={r.id} className='mb-2 rounded-xl border border-slate-200 p-3 text-sm'>{r.report_no} · {r.status}</div>)}</section></div>
}

function IssuersReportsPage() {
  const { t } = useI18n()
  const [issuerId, setIssuerId] = React.useState('')
  const [issuers, setIssuers] = React.useState<any[]>([])
  const [rows, setRows] = React.useState<any[]>([])
  React.useEffect(() => { void api<any[]>('/api/settings/issuers').then(setIssuers).catch(() => setIssuers([])) }, [])
  return <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 space-y-3'><Combobox value={issuerId} onChange={setIssuerId} options={issuers.map((i) => i.id)} placeholder={t('issuerId')} /><Button onClick={() => { if (!issuerId) return; void api<any[]>(`/api/issuers/${issuerId}/reports`).then(setRows).catch(() => setRows([])) }}>{t('loadIssuerReports')}</Button>{rows.map((r) => <div key={r.id} className='rounded-lg border border-slate-200 p-3 text-sm'>{r.report_no}</div>)}</section>
}

function ExportsPage() {
  const [rows, setRows] = React.useState<any[]>([])
  React.useEffect(() => { void api<any[]>('/api/exports').then(setRows).catch(() => setRows([])) }, [])
  return <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 space-y-2'>{rows.map((r) => <a key={r.id} href={r.url} target='_blank' className='block rounded-lg border border-slate-200 p-3 text-sm'>{r.file_name}</a>)}</section>
}

function SettingsPage() {
  const { t } = useI18n()
  const [profiles, setProfiles] = React.useState<any[]>([])
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({ name: '', legal_text: '', address: '', phone: '', email: '' })
  const load = () => api<any[]>('/api/settings/company-profiles').then(setProfiles).catch(() => setProfiles([]))
  React.useEffect(() => { void load() }, [])
  return <div className='space-y-6'><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'><div className='mb-4 flex items-center justify-between'><h1 className='text-2xl font-semibold'>{t('companyProfiles')}</h1><Button onClick={() => setOpen(true)}>{t('create')}</Button></div>{profiles.map((p) => <div key={p.id} className='mb-2 rounded-xl border border-slate-200 p-3 text-sm'>{p.name}</div>)}</section><DialogRoot open={open} onOpenChange={setOpen}><DialogContent><div className='space-y-3'><Label>{t('name')}</Label><Input value={form.name} onChange={(e) => setForm((x) => ({ ...x, name: e.target.value }))} /><Label>{t('legalText')}</Label><Textarea value={form.legal_text} onChange={(e) => setForm((x) => ({ ...x, legal_text: e.target.value }))} /><Label>{t('address')}</Label><Input value={form.address} onChange={(e) => setForm((x) => ({ ...x, address: e.target.value }))} /><Label>{t('phone')}</Label><Input value={form.phone} onChange={(e) => setForm((x) => ({ ...x, phone: e.target.value }))} /><Label>{t('email')}</Label><Input value={form.email} onChange={(e) => setForm((x) => ({ ...x, email: e.target.value }))} /><Button onClick={async () => { await api('/api/settings/company-profiles', { method: 'POST', body: JSON.stringify(form) }); toast.success(t('save')); setOpen(false); load() }}>{t('save')}</Button></div></DialogContent></DialogRoot></div>
}

function ReportWizardPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [step, setStep] = React.useState(0)
  const [customers, setCustomers] = React.useState<string[]>([])
  const [products, setProducts] = React.useState<ProductRow[]>([])
  const [library, setLibrary] = React.useState<any[]>([])
  const [data, setData] = React.useState<any>({ customer: '', product: '', valve_type: '', complaint: '', problems: '', actions: [] as ReportActionRow[], spares: '', result: '' })

  React.useEffect(() => {
    void api<any[]>('/api/customers').then((x) => setCustomers(x.map((i) => i.name))).catch(() => setCustomers([]))
    void api<any[]>('/api/products').then((x) => setProducts(x as ProductRow[])).catch(() => setProducts([]))
  }, [])

  React.useEffect(() => {
    if (step !== 5) return
    const query = data.valve_type ? `?valve_type=${encodeURIComponent(data.valve_type)}` : ''
    void api<any[]>(`/api/action-library${query}`).then(setLibrary).catch(() => setLibrary([]))
  }, [step, data.valve_type])

  const steps = [t('general'), t('product'), t('shipping'), t('complaint'), t('problems'), t('actions'), t('spares'), t('photosResult')]

  const toggleAction = (item: any, selected: boolean) => {
    if (selected) {
      setData((p: any) => ({
        ...p,
        actions: [...p.actions, {
          library_id: item.id,
          snapshot_text_tr: item.text_tr,
          snapshot_text_en: item.text_en,
          manual_extension_tr: '',
          manual_extension_en: '',
          order_index: p.actions.length,
        }],
      }))
    } else {
      setData((p: any) => ({ ...p, actions: p.actions.filter((a: ReportActionRow) => a.library_id !== item.id) }))
    }
  }

  const saveReport = async () => {
    await api('/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        language: lang,
        status: 'draft',
        customer_id: data.customer || 'unknown-customer',
        responsible_user: 'frontend-user',
        products: [],
        blocks: { complaint: [{ text: data.complaint }], problems: [{ text: data.problems }] },
        actions: data.actions,
        spares: [],
        result_notes: data.result,
      }),
    })
    toast.success(t('save'))
  }

  return <div className='mx-auto max-w-[920px] space-y-6'><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'><h1 className='text-2xl font-semibold'>{t('wizardStep')} {step + 1} / 8</h1><p className='text-sm text-slate-500'>{steps[step]}</p><div className='mt-2 h-1.5 rounded-full bg-slate-100'><div className='h-full bg-slate-900' style={{ width: `${((step + 1) / 8) * 100}%` }} /></div><div className='mt-6 space-y-4'>{step === 0 && <Combobox value={data.customer} onChange={(v) => setData((p: any) => ({ ...p, customer: v }))} options={customers} placeholder={t('customerSelect')} />}{step === 1 && <><Combobox value={data.product} onChange={(v) => { const selected = products.find((p) => `${p.type || 'Product'} / ${p.tag_no || p.id}` === v); setData((p: any) => ({ ...p, product: v, valve_type: selected?.valve_type || '' })) }} options={products.map((p) => `${p.type || 'Product'} / ${p.tag_no || p.id}`)} placeholder={t('productSelect')} /><Label>{t('valveType')}</Label><Input value={data.valve_type} onChange={(e) => setData((p: any) => ({ ...p, valve_type: e.target.value }))} /></>}{step === 2 && <div className='grid gap-3 md:grid-cols-2'><Input type='date' /><Input type='date' /></div>}{step === 3 && <Textarea value={data.complaint} onChange={(e) => setData((p: any) => ({ ...p, complaint: e.target.value }))} />}{step === 4 && <Textarea value={data.problems} onChange={(e) => setData((p: any) => ({ ...p, problems: e.target.value }))} />}{step === 5 && <div className='space-y-4'><Label>{t('actionScopeFilter')}: {data.valve_type || '-'}</Label>{library.map((item) => { const checked = data.actions.some((a: ReportActionRow) => a.library_id === item.id); return <div key={item.id} className='rounded-lg border border-slate-200 p-3 text-sm'><label className='flex items-center gap-2'><input type='checkbox' checked={checked} onChange={(e) => toggleAction(item, e.target.checked)} />{lang === 'tr' ? item.text_tr : item.text_en}</label>{checked && <Textarea className='mt-2' value={(data.actions.find((a: ReportActionRow) => a.library_id === item.id)?.[`manual_extension_${lang}` as 'manual_extension_tr' | 'manual_extension_en']) || ''} onChange={(e) => setData((p: any) => ({ ...p, actions: p.actions.map((a: ReportActionRow) => a.library_id === item.id ? { ...a, [`manual_extension_${lang}`]: e.target.value } : a) }))} placeholder={t('manualExtension')} />}</div> })}</div>}{step === 6 && <Textarea value={data.spares} onChange={(e) => setData((p: any) => ({ ...p, spares: e.target.value }))} />}{step === 7 && <Textarea value={data.result} onChange={(e) => setData((p: any) => ({ ...p, result: e.target.value }))} />}</div></section><div className='sticky bottom-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm'><div className='flex gap-2'><Button variant='secondary' onClick={() => setStep((s) => Math.max(0, s - 1))}><ArrowLeft size={14} className='mr-1' />{t('back')}</Button><Button variant='ghost' onClick={() => { void saveReport() }}>{t('save')}</Button><Button onClick={() => step < 7 ? setStep((s) => s + 1) : navigate('/reports')}>{t('next')}<ArrowRight size={14} className='ml-1' /></Button></div></div></div>
}

function App() {
  const [lang, setLang] = React.useState<Lang>((localStorage.getItem('lang') as Lang) || 'tr')
  React.useEffect(() => localStorage.setItem('lang', lang), [lang])
  const t = React.useCallback((k: string) => (dict[k]?.[lang] || k), [lang])
  return <I18nContext.Provider value={{ lang, setLang, t }}><BrowserRouter><Shell><Routes><Route path='/' element={<Navigate to='/dashboard' replace />} /><Route path='/dashboard' element={<DashboardPage />} /><Route path='/customers' element={<SimpleCrudPage title={t('customers')} endpoint='/api/customers' fields={[{ key: 'name', label: t('name') }, { key: 'email', label: t('email') }]} />} /><Route path='/products' element={<SimpleCrudPage title={t('products')} endpoint='/api/products' fields={[{ key: 'customer_id', label: 'customer_id' }, { key: 'brand_id', label: 'brand_id' }, { key: 'model_id', label: 'model_id' }, { key: 'type', label: 'type' }, { key: 'valve_type', label: 'valve_type' }]} />} /><Route path='/reports' element={<ReportsPage />} /><Route path='/reports/new' element={<ReportWizardPage />} /><Route path='/templates' element={<ActionLibraryPage />} /><Route path='/issuers' element={<IssuersReportsPage />} /><Route path='/exports' element={<ExportsPage />} /><Route path='/settings' element={<SettingsPage />} /></Routes></Shell></BrowserRouter></I18nContext.Provider>
}

createRoot(document.getElementById('root')!).render(<App />)
