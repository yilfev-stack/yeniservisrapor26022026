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
        <div className='mb-6 px-2'><img src='/demart-logo.svg' alt='Demart Logo' className='h-14 w-auto' /></div>
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
  return <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 text-sm'><div className='mb-4 flex items-center gap-3'><img src='/demart-logo.svg' alt='Demart Logo' className='h-10 w-auto' /><span className='text-slate-500'>Demart - Servis Raporlama</span></div>{JSON.stringify(kpi)}</section>
}

function ActionLibraryPage() {
  const { t } = useI18n()
  const [valveType, setValveType] = React.useState('')
  const [items, setItems] = React.useState<any[]>([])
  const load = async () => setItems(await api<any[]>(`/api/action-library${valveType ? `?valve_type=${encodeURIComponent(valveType)}` : ''}`))
  React.useEffect(() => { void load().catch(() => setItems([])) }, [valveType])
  return <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 space-y-3'><Label>{t('valveType')}</Label><Input value={valveType} onChange={(e) => setValveType(e.target.value)} /><div className='space-y-2'>{items.map((i) => <div key={i.id} className='rounded-lg border border-slate-200 p-3 text-sm'>{i.scope} · {i.valve_type || '-'} · {i.title_tr}</div>)}</div></section>
}


type CustomerBranch = {
  branch_name: string
  tax_no: string
  tax_office: string
  email: string
  phone: string
  address: string
  shipping_address: string
  city: string
  country: string
}

type CustomerContact = {
  id?: string
  name: string
  title: string
  email: string
  phone: string
  note: string
}

type CustomerForm = {
  name: string
  tax_no: string
  tax_office: string
  email: string
  phone: string
  address: string
  shipping_address: string
  city: string
  country: string
  branches: CustomerBranch[]
}

const emptyBranch = (): CustomerBranch => ({ branch_name: '', tax_no: '', tax_office: '', email: '', phone: '', address: '', shipping_address: '', city: '', country: '' })
const emptyCustomer = (): CustomerForm => ({ name: '', tax_no: '', tax_office: '', email: '', phone: '', address: '', shipping_address: '', city: '', country: '', branches: [] })
const emptyContact = (): CustomerContact => ({ name: '', title: '', email: '', phone: '', note: '' })

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneDigits = (v: string) => v.replace(/\D/g, '').replace(/^90/, '').slice(0, 10)
const formatPhone = (raw: string) => {
  const d = phoneDigits(raw)
  if (!d) return ''
  const p1 = d.slice(0, 3)
  const p2 = d.slice(3, 6)
  const p3 = d.slice(6, 8)
  const p4 = d.slice(8, 10)
  return `+90 ${p1}${p2 ? ` ${p2}` : ''}${p3 ? ` ${p3}` : ''}${p4 ? ` ${p4}` : ''}`.trim()
}
const isValidEmail = (v: string) => !v || EMAIL_RE.test(v)
const isValidPhone = (v: string) => !v || phoneDigits(v).length === 10

function CustomersPage() {
  const [rows, setRows] = React.useState<any[]>([])
  const [customerId, setCustomerId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState<CustomerForm>(emptyCustomer)
  const [contacts, setContacts] = React.useState<CustomerContact[]>([])
  const [editing, setEditing] = React.useState(false)

  const loadCustomers = React.useCallback(async () => {
    try {
      setRows(await api<any[]>('/api/customers'))
    } catch {
      setRows([])
    }
  }, [])

  React.useEffect(() => { void loadCustomers() }, [loadCustomers])

  const openNew = () => {
    setCustomerId(null)
    setForm(emptyCustomer())
    setContacts([])
    setEditing(true)
  }

  const openExisting = async (id: string) => {
    const customer = await api<any>(`/api/customers/${id}`)
    const customerContacts = await api<any[]>(`/api/customers/${id}/contacts`)
    setCustomerId(id)
    setForm({
      name: customer.name || '',
      tax_no: customer.tax_no || '',
      tax_office: customer.tax_office || '',
      email: customer.email || '',
      phone: formatPhone(customer.phone || ''),
      address: customer.address || '',
      shipping_address: customer.shipping_address || '',
      city: customer.city || '',
      country: customer.country || '',
      branches: (customer.branches || []).map((b: any) => ({ ...emptyBranch(), ...b, phone: formatPhone(b.phone || '') })),
    })
    setContacts(customerContacts.map((c) => ({ id: c.id, name: c.name || '', title: c.title || '', email: c.email || '', phone: formatPhone(c.phone || ''), note: c.note || '' })))
    setEditing(false)
  }

  const validate = () => {
    if (!form.name.trim()) return 'Müşteri adı zorunlu.'
    if (!form.shipping_address.trim()) return 'Sevk adresi zorunlu.'
    if (!isValidEmail(form.email)) return 'E-posta formatı hatalı.'
    if (!isValidPhone(form.phone)) return 'Telefon formatı +90 535 109 10 02 şeklinde olmalı.'
    for (const [i, b] of form.branches.entries()) {
      if (!b.branch_name.trim()) return `Şube ${i + 1}: Şube adı zorunlu.`
      if (!b.shipping_address.trim()) return `Şube ${i + 1}: Sevk adresi zorunlu.`
      if (!isValidEmail(b.email)) return `Şube ${i + 1}: E-posta formatı hatalı.`
      if (!isValidPhone(b.phone)) return `Şube ${i + 1}: Telefon formatı hatalı.`
    }
    for (const [i, c] of contacts.entries()) {
      if (!c.name.trim()) return `Yetkili ${i + 1}: Ad Soyad zorunlu.`
      if (!isValidEmail(c.email)) return `Yetkili ${i + 1}: E-posta formatı hatalı.`
      if (!isValidPhone(c.phone)) return `Yetkili ${i + 1}: Telefon formatı hatalı.`
    }
    return ''
  }

  const save = async () => {
    const err = validate()
    if (err) return toast.error(err)
    const payload = {
      ...form,
      name: form.name.trim(),
      shipping_address: form.shipping_address.trim(),
      phone: phoneDigits(form.phone),
      branches: form.branches.map((b) => ({ ...b, phone: phoneDigits(b.phone) })),
    }

    let id = customerId
    if (id) {
      await api(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    } else {
      const created = await api<{ id: string }>('/api/customers', { method: 'POST', body: JSON.stringify(payload) })
      id = created.id
      setCustomerId(id)
    }

    if (id) {
      const existing = await api<any[]>(`/api/customers/${id}/contacts`)
      await Promise.all(existing.map((c) => api(`/api/contacts/${c.id}`, { method: 'DELETE' })))
      await Promise.all(contacts.map((c) => api(`/api/customers/${id}/contacts`, {
        method: 'POST',
        body: JSON.stringify({ customer_id: id, name: c.name.trim(), title: c.title, email: c.email, phone: phoneDigits(c.phone), department: null, note: c.note, is_default: false }),
      })))
    }

    toast.success('Kaydedildi')
    setEditing(false)
    await loadCustomers()
  }

  if (!customerId && !editing) {
    return <div className='space-y-6'><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'><div className='mb-4 flex items-center justify-between'><h1 className='text-2xl font-semibold'>Müşteriler</h1><Button onClick={openNew}><Plus size={14} className='mr-1' />Yeni Müşteri</Button></div>{rows.length === 0 ? <p className='text-sm text-slate-500'>Kayıt yok</p> : <div className='space-y-2'>{rows.map((r) => <div key={r.id} className='flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm'><div><p className='font-medium'>{r.name}</p><p className='text-slate-500'>{r.tax_no || '-'} · {r.city || '-'}</p></div><Button variant='secondary' onClick={() => { void openExisting(r.id) }}>Detayı Aç</Button></div>)}</div>}</section></div>
  }

  return <div className='mx-auto max-w-[980px] space-y-6'><div className='flex items-center justify-between'><Button variant='ghost' onClick={() => { setCustomerId(null); setEditing(false) }}><ArrowLeft size={14} className='mr-1' />Geri</Button>{!editing ? <Button onClick={() => setEditing(true)}>Düzenle</Button> : <div className='flex gap-2'><Button variant='secondary' onClick={() => { if (!customerId) { setEditing(false); setCustomerId(null) } else { void openExisting(customerId) } }}>İptal</Button><Button onClick={() => { void save() }}>Kaydet</Button></div>}</div>
    <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'>
      <h1 className='mb-5 text-2xl font-semibold'>{customerId ? 'Müşteriyi Düzenle' : 'Yeni Müşteri'}</h1>
      <div className='grid gap-3 md:grid-cols-2'>
        <div className='md:col-span-2'><Label>Müşteri Adı *</Label><Input disabled={!editing} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
        <div><Label>Vergi No</Label><Input disabled={!editing} value={form.tax_no} onChange={(e) => setForm((p) => ({ ...p, tax_no: e.target.value }))} /></div>
        <div><Label>Vergi Dairesi</Label><Input disabled={!editing} value={form.tax_office} onChange={(e) => setForm((p) => ({ ...p, tax_office: e.target.value }))} /></div>
        <div><Label>E-posta</Label><Input disabled={!editing} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
        <div><Label>Telefon</Label><Input disabled={!editing} value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: formatPhone(e.target.value) }))} placeholder='+90 535 109 10 02' /></div>
        <div className='md:col-span-2'><Label>Adres</Label><Textarea disabled={!editing} value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} /></div>
        <div className='md:col-span-2'><Label>Sevk Adresi *</Label><Textarea disabled={!editing} value={form.shipping_address} onChange={(e) => setForm((p) => ({ ...p, shipping_address: e.target.value }))} /></div>
        <div><Label>Şehir</Label><Input disabled={!editing} value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} /></div>
        <div><Label>Ülke</Label><Input disabled={!editing} value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} /></div>
      </div>
    </section>

    <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 space-y-3'>
      <div className='flex items-center justify-between'><h2 className='text-xl font-semibold'>Şubeler</h2>{editing && <Button variant='secondary' onClick={() => setForm((p) => ({ ...p, branches: [...p.branches, emptyBranch()] }))}>+ Şube Ekle</Button>}</div>
      {form.branches.length === 0 && <p className='text-sm text-slate-500'>Şube yok</p>}
      {form.branches.map((b, idx) => <div key={idx} className='rounded-xl border border-slate-200 p-4'><div className='mb-2 flex items-center justify-between'><p className='font-medium'>Şube #{idx + 1}</p>{editing && <Button variant='ghost' onClick={() => setForm((p) => ({ ...p, branches: p.branches.filter((_, i) => i !== idx) }))}>Sil</Button>}</div><div className='grid gap-3 md:grid-cols-2'><div className='md:col-span-2'><Label>Şube Adı *</Label><Input disabled={!editing} value={b.branch_name} onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, branch_name: e.target.value } : x) }))} /></div><div><Label>Vergi No</Label><Input disabled={!editing} value={b.tax_no} onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, tax_no: e.target.value } : x) }))} /></div><div><Label>Vergi Dairesi</Label><Input disabled={!editing} value={b.tax_office} onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, tax_office: e.target.value } : x) }))} /></div><div><Label>E-posta</Label><Input disabled={!editing} value={b.email} onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, email: e.target.value } : x) }))} /></div><div><Label>Telefon</Label><Input disabled={!editing} value={b.phone} placeholder='+90 535 109 10 02' onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, phone: formatPhone(e.target.value) } : x) }))} /></div><div className='md:col-span-2'><Label>Adres</Label><Textarea disabled={!editing} value={b.address} onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, address: e.target.value } : x) }))} /></div><div className='md:col-span-2'><Label>Sevk Adresi *</Label><Textarea disabled={!editing} value={b.shipping_address} onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, shipping_address: e.target.value } : x) }))} /></div><div><Label>Şehir</Label><Input disabled={!editing} value={b.city} onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, city: e.target.value } : x) }))} /></div><div><Label>Ülke</Label><Input disabled={!editing} value={b.country} onChange={(e) => setForm((p) => ({ ...p, branches: p.branches.map((x, i) => i === idx ? { ...x, country: e.target.value } : x) }))} /></div></div></div>)}
    </section>

    <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 space-y-3'>
      <div className='flex items-center justify-between'><h2 className='text-xl font-semibold'>Yetkili Kişiler</h2>{editing && <Button className='bg-emerald-600 hover:bg-emerald-700' onClick={() => setContacts((p) => [...p, emptyContact()])}>+ Yeni Yetkili</Button>}</div>
      {contacts.length === 0 && <p className='text-sm text-slate-500'>Yetkili kişi yok</p>}
      {contacts.map((c, idx) => <div key={idx} className='rounded-xl border border-slate-200 p-4'><div className='mb-2 flex items-center justify-between'><p className='font-medium'>Yetkili #{idx + 1}</p>{editing && <Button variant='ghost' onClick={() => setContacts((p) => p.filter((_, i) => i !== idx))}>Sil</Button>}</div><div className='grid gap-3 md:grid-cols-2'><div><Label>Ad Soyad *</Label><Input disabled={!editing} value={c.name} onChange={(e) => setContacts((p) => p.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} /></div><div><Label>Ünvan</Label><Input disabled={!editing} value={c.title} onChange={(e) => setContacts((p) => p.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))} /></div><div><Label>E-posta</Label><Input disabled={!editing} value={c.email} onChange={(e) => setContacts((p) => p.map((x, i) => i === idx ? { ...x, email: e.target.value } : x))} /></div><div><Label>Telefon</Label><Input disabled={!editing} value={c.phone} placeholder='+90 535 109 10 02' onChange={(e) => setContacts((p) => p.map((x, i) => i === idx ? { ...x, phone: formatPhone(e.target.value) } : x))} /></div><div className='md:col-span-2'><Label>Not</Label><Textarea disabled={!editing} value={c.note} onChange={(e) => setContacts((p) => p.map((x, i) => i === idx ? { ...x, note: e.target.value } : x))} /></div></div></div>)}
    </section></div>
}


type ProductForm = {
  customer_id: string
  brand_id: string
  model_id: string
  type: string
  valve_type: string
  manufacturer: string
  serial_no: string
  tag_no: string
  size: string
  pressure_class: string
  connection_type: string
  body_style: string
  fail_action: string
  body_material: string
  trim_material: string
  seat_material: string
  stem_material: string
  actuator: { type: string; brand: string; model: string; serial_no: string; action: string; model_same_as_valve: boolean; serial_same_as_valve: boolean }
  accessories: Array<{ key: string; installed: boolean; brand: string; model: string; serial_no: string; notes: string }>
}

type ProductOptionLists = {
  type: string[]
  valve_type: string[]
  size: string[]
  pressure_class: string[]
  connection_type: string[]
  body_style: string[]
  fail_action: string[]
  body_material: string[]
  trim_material: string[]
  seat_material: string[]
  stem_material: string[]
  actuator_type: string[]
  actuator_brand: string[]
  actuator_model: string[]
  actuator_action: string[]
  accessory_key: string[]
  accessory_brand: string[]
  accessory_model: string[]
}

const defaultProductOptions: ProductOptionLists = {
  type: [],
  valve_type: ['control', 'on_off', 'safety', 'other'],
  size: [],
  pressure_class: [],
  connection_type: [],
  body_style: [],
  fail_action: [],
  body_material: [],
  trim_material: [],
  seat_material: [],
  stem_material: [],
  actuator_type: ['pneumatic_diaphragm', 'pneumatic_piston', 'electric', 'hydraulic', 'other'],
  actuator_brand: [],
  actuator_model: [],
  actuator_action: [],
  accessory_key: ['positioner', 'solenoid', 'limit_switch', 'afr', 'booster', 'ip_converter', 'other'],
  accessory_brand: [],
  accessory_model: [],
}

const makeAccessory = (key: string) => ({ key, installed: false, brand: '', model: '', serial_no: '', notes: '' })
const emptyProduct = (): ProductForm => ({
  customer_id: '', brand_id: '', model_id: '', type: '', valve_type: 'control', manufacturer: '', serial_no: '', tag_no: '', size: '', pressure_class: '', connection_type: '', body_style: '', fail_action: '', body_material: '', trim_material: '', seat_material: '', stem_material: '',
  actuator: { type: 'pneumatic_diaphragm', brand: '', model: '', serial_no: '', action: '', model_same_as_valve: false, serial_same_as_valve: false },
  accessories: defaultProductOptions.accessory_key.map(makeAccessory),
})

function ProductsPage() {
  const [rows, setRows] = React.useState<any[]>([])
  const [customers, setCustomers] = React.useState<any[]>([])
  const [brands, setBrands] = React.useState<any[]>([])
  const [models, setModels] = React.useState<any[]>([])
  const [form, setForm] = React.useState<ProductForm>(emptyProduct)
  const [productId, setProductId] = React.useState<string | null>(null)
  const [editing, setEditing] = React.useState(true)
  const [options, setOptions] = React.useState<ProductOptionLists>(defaultProductOptions)
  const [newAccessoryKey, setNewAccessoryKey] = React.useState('')

  const loadRows = React.useCallback(async () => {
    try { setRows(await api<any[]>('/api/products')) } catch { setRows([]) }
  }, [])

  const loadOptions = React.useCallback(async () => {
    try {
      const data = await api<Partial<ProductOptionLists>>('/api/product-options')
      setOptions((prev) => ({ ...prev, ...data }))
    } catch {
      setOptions(defaultProductOptions)
    }
  }, [])

  React.useEffect(() => {
    void loadRows()
    void loadOptions()
    void api<any[]>('/api/customers').then(setCustomers).catch(() => setCustomers([]))
    void api<any[]>('/api/brands').then(setBrands).catch(() => setBrands([]))
  }, [loadRows, loadOptions])

  React.useEffect(() => {
    if (!form.brand_id) return setModels([])
    void api<any[]>(`/api/models?brand_id=${encodeURIComponent(form.brand_id)}`).then(setModels).catch(() => setModels([]))
  }, [form.brand_id])

  const saveOptionValue = async (field: keyof ProductOptionLists, value: string) => {
    const cleaned = value.trim()
    if (!cleaned) return
    await api(`/api/product-options/${field}/values`, { method: 'POST', body: JSON.stringify({ value: cleaned }) })
    setOptions((prev) => ({ ...prev, [field]: prev[field].includes(cleaned) ? prev[field] : [...prev[field], cleaned] }))
  }

  const saveSingleOption = async (field: keyof ProductOptionLists, value: string) => {
    if (!value.trim()) return
    await saveOptionValue(field, value)
    toast.success('Madde kaydedildi')
  }

  const saveCurrentValuesToLibrary = async () => {
    const tasks: Array<[keyof ProductOptionLists, string]> = [
      ['type', form.type], ['valve_type', form.valve_type], ['size', form.size], ['pressure_class', form.pressure_class], ['connection_type', form.connection_type], ['body_style', form.body_style], ['fail_action', form.fail_action],
      ['body_material', form.body_material], ['trim_material', form.trim_material], ['seat_material', form.seat_material], ['stem_material', form.stem_material],
      ['actuator_type', form.actuator.type], ['actuator_brand', form.actuator.brand], ['actuator_model', form.actuator.model], ['actuator_action', form.actuator.action],
    ]
    for (const a of form.accessories) tasks.push(['accessory_key', a.key], ['accessory_brand', a.brand], ['accessory_model', a.model])
    for (const [field, value] of tasks) if (value?.trim()) { try { await saveOptionValue(field, value) } catch {} }
    toast.success('Girilen alanlar seçenek listesine kaydedildi')
  }

  const normalizeProduct = (p: any, list: ProductOptionLists): ProductForm => {
    const existingKeys = new Set<string>((p.accessories || []).map((a: any) => String(a.key)))
    const mergedKeys: string[] = Array.from(new Set([...list.accessory_key, ...Array.from(existingKeys)]))
    return { ...emptyProduct(), ...p, actuator: { ...emptyProduct().actuator, ...(p.actuator || {}) }, accessories: mergedKeys.map((k) => ({ ...makeAccessory(k), ...(p.accessories || []).find((a: any) => a.key === k) })) }
  }

  const openNew = () => { setProductId(null); setForm(emptyProduct()); setEditing(true) }
  const openExisting = async (id: string) => {
    const p = await api<any>(`/api/products/${id}`)
    const dynamic = { ...options, valve_type: Array.from(new Set([...options.valve_type, ...(p.valve_type ? [p.valve_type] : [])])), actuator_type: Array.from(new Set([...options.actuator_type, ...(p.actuator?.type ? [p.actuator.type] : [])])), accessory_key: Array.from(new Set([...options.accessory_key, ...((p.accessories || []).map((a: any) => a.key))])) }
    setOptions(dynamic)
    setProductId(id)
    setForm(normalizeProduct(p, dynamic))
    setEditing(false)
  }

  const deleteProduct = async (id: string) => {
    await api(`/api/products/${id}`, { method: 'DELETE' })
    if (productId === id) openNew()
    await loadRows()
    toast.success('Ürün silindi')
  }

  const addCustomAccessory = async () => {
    const value = newAccessoryKey.trim().toLowerCase().replace(/\s+/g, '_')
    if (!value) return
    await saveOptionValue('accessory_key', value)
    setForm((p) => p.accessories.some((a) => a.key === value) ? p : { ...p, accessories: [...p.accessories, makeAccessory(value)] })
    setNewAccessoryKey('')
  }

  const validate = () => {
    if (!form.brand_id) return 'Marka zorunlu.'
    if (!form.model_id) return 'Model zorunlu.'
    if (!form.type.trim()) return 'Tip zorunlu.'
    return ''
  }

  const save = async () => {
    const err = validate()
    if (err) return toast.error(err)
    const payload = { ...form, customer_id: form.customer_id || 'unknown-customer', accessories: form.accessories.filter((a) => a.installed), technical_card: {} }
    if (productId) await api(`/api/products/${productId}`, { method: 'PUT', body: JSON.stringify(payload) })
    else {
      const created = await api<{ id: string }>('/api/products', { method: 'POST', body: JSON.stringify(payload) })
      setProductId(created.id)
    }
    await saveCurrentValuesToLibrary()
    toast.success('Kaydedildi')
    setEditing(false)
    await loadRows()
  }

  return <div className='mx-auto max-w-[980px] space-y-6'>
    <div className='flex items-center justify-between'>
      <h1 className='text-2xl font-semibold'>Yeni Ürün</h1>
      <div className='flex gap-2'>
        <Button variant='ghost' onClick={openNew}>Yeni</Button>
        <Button variant='secondary' onClick={() => { if (productId) void openExisting(productId) }}>İptal</Button>
        <Button variant='secondary' disabled={!editing} onClick={() => { void saveCurrentValuesToLibrary() }}>Listeye Kaydet</Button>
        <Button onClick={() => { void save() }}>Kaydet</Button>
      </div>
    </div>

    <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'>
      <div className='grid gap-3 md:grid-cols-2'>
        <div className='md:col-span-2'><Label>Müşteri (Opsiyonel)</Label><select disabled={!editing} className='h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm' value={form.customer_id} onChange={(e) => setForm((p) => ({ ...p, customer_id: e.target.value }))}><option value=''>Seçiniz...</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><Label>Marka *</Label><select disabled={!editing} className='h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm' value={form.brand_id} onChange={(e) => setForm((p) => ({ ...p, brand_id: e.target.value, model_id: '' }))}><option value=''>Marka seçiniz...</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
        <div><Label>Model *</Label><select disabled={!editing} className='h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm' value={form.model_id} onChange={(e) => setForm((p) => ({ ...p, model_id: e.target.value }))}><option value=''>Model seçiniz...</option>{models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>

        <div className='md:col-span-2'><Label>Tip *</Label><div className='flex gap-2'><Input list='type-options' disabled={!editing} value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} placeholder='Örn: Actuated Butterfly Valve' /><Button disabled={!editing} onClick={() => { void saveSingleOption('type', form.type) }}>Kaydet</Button></div><datalist id='type-options'>{options.type.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>DN/NPS</Label><div className='flex gap-2'><Input list='size-options' disabled={!editing} value={form.size} onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('size', form.size) }}>Kaydet</Button></div><datalist id='size-options'>{options.size.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>PN/Class</Label><div className='flex gap-2'><Input list='pressure-options' disabled={!editing} value={form.pressure_class} onChange={(e) => setForm((p) => ({ ...p, pressure_class: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('pressure_class', form.pressure_class) }}>Kaydet</Button></div><datalist id='pressure-options'>{options.pressure_class.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>Seri No</Label><Input disabled={!editing} value={form.serial_no} onChange={(e) => setForm((p) => ({ ...p, serial_no: e.target.value }))} /></div>
        <div><Label>Tag No</Label><Input disabled={!editing} value={form.tag_no} onChange={(e) => setForm((p) => ({ ...p, tag_no: e.target.value }))} /></div>
        <div><Label>Vana Tipi</Label><select disabled={!editing} className='h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm' value={form.valve_type} onChange={(e) => setForm((p) => ({ ...p, valve_type: e.target.value }))}>{options.valve_type.map((v) => <option key={v} value={v}>{v}</option>)}</select></div>
        <div><Label>Üretici</Label><Input disabled={!editing} value={form.manufacturer} onChange={(e) => setForm((p) => ({ ...p, manufacturer: e.target.value }))} /></div>
        <div><Label>Bağlantı</Label><div className='flex gap-2'><Input list='connection-options' disabled={!editing} value={form.connection_type} onChange={(e) => setForm((p) => ({ ...p, connection_type: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('connection_type', form.connection_type) }}>Kaydet</Button></div><datalist id='connection-options'>{options.connection_type.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>Gövde Stili</Label><div className='flex gap-2'><Input list='body-style-options' disabled={!editing} value={form.body_style} onChange={(e) => setForm((p) => ({ ...p, body_style: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('body_style', form.body_style) }}>Kaydet</Button></div><datalist id='body-style-options'>{options.body_style.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div className='md:col-span-2'><Label>Fail Action (opsiyonel)</Label><div className='flex gap-2'><Input list='fail-action-options' disabled={!editing} value={form.fail_action} onChange={(e) => setForm((p) => ({ ...p, fail_action: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('fail_action', form.fail_action) }}>Kaydet</Button></div><datalist id='fail-action-options'>{options.fail_action.map((v) => <option key={v} value={v} />)}</datalist></div>
      </div>
    </section>

    <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'>
      <h2 className='mb-3 text-lg font-semibold'>Materials & Trim</h2>
      <div className='grid gap-3 md:grid-cols-2'>
        <div><Label>Body Material</Label><div className='flex gap-2'><Input list='body-material-options' disabled={!editing} value={form.body_material} onChange={(e) => setForm((p) => ({ ...p, body_material: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('body_material', form.body_material) }}>Kaydet</Button></div><datalist id='body-material-options'>{options.body_material.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>Trim Material</Label><div className='flex gap-2'><Input list='trim-material-options' disabled={!editing} value={form.trim_material} onChange={(e) => setForm((p) => ({ ...p, trim_material: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('trim_material', form.trim_material) }}>Kaydet</Button></div><datalist id='trim-material-options'>{options.trim_material.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>Seat Material</Label><div className='flex gap-2'><Input list='seat-material-options' disabled={!editing} value={form.seat_material} onChange={(e) => setForm((p) => ({ ...p, seat_material: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('seat_material', form.seat_material) }}>Kaydet</Button></div><datalist id='seat-material-options'>{options.seat_material.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>Stem Material</Label><div className='flex gap-2'><Input list='stem-material-options' disabled={!editing} value={form.stem_material} onChange={(e) => setForm((p) => ({ ...p, stem_material: e.target.value }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('stem_material', form.stem_material) }}>Kaydet</Button></div><datalist id='stem-material-options'>{options.stem_material.map((v) => <option key={v} value={v} />)}</datalist></div>
      </div>
    </section>

    <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'>
      <h2 className='mb-3 text-lg font-semibold'>Actuator</h2>
      <div className='grid gap-3 md:grid-cols-2'>
        <div><Label>Type</Label><select disabled={!editing} className='h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm' value={form.actuator.type} onChange={(e) => setForm((p) => ({ ...p, actuator: { ...p.actuator, type: e.target.value } }))}>{options.actuator_type.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
        <div><Label>Brand</Label><div className='flex gap-2'><Input list='actuator-brand-options' disabled={!editing} value={form.actuator.brand} onChange={(e) => setForm((p) => ({ ...p, actuator: { ...p.actuator, brand: e.target.value } }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('actuator_brand', form.actuator.brand) }}>Kaydet</Button></div><datalist id='actuator-brand-options'>{options.actuator_brand.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>Model</Label><div className='flex gap-2'><Input list='actuator-model-options' disabled={!editing || form.actuator.model_same_as_valve} value={form.actuator.model_same_as_valve ? form.model_id : form.actuator.model} onChange={(e) => setForm((p) => ({ ...p, actuator: { ...p.actuator, model: e.target.value } }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('actuator_model', form.actuator.model) }}>Kaydet</Button></div><datalist id='actuator-model-options'>{options.actuator_model.map((v) => <option key={v} value={v} />)}</datalist></div>
        <div><Label>Serial</Label><Input disabled={!editing || form.actuator.serial_same_as_valve} value={form.actuator.serial_same_as_valve ? form.serial_no : form.actuator.serial_no} onChange={(e) => setForm((p) => ({ ...p, actuator: { ...p.actuator, serial_no: e.target.value } }))} /></div>
        <label className='flex items-center gap-2 text-sm'><input type='checkbox' disabled={!editing} checked={form.actuator.model_same_as_valve} onChange={(e) => setForm((p) => ({ ...p, actuator: { ...p.actuator, model_same_as_valve: e.target.checked, model: e.target.checked ? p.model_id : p.actuator.model } }))} />model_same_as_valve</label>
        <label className='flex items-center gap-2 text-sm'><input type='checkbox' disabled={!editing} checked={form.actuator.serial_same_as_valve} onChange={(e) => setForm((p) => ({ ...p, actuator: { ...p.actuator, serial_same_as_valve: e.target.checked, serial_no: e.target.checked ? p.serial_no : p.actuator.serial_no } }))} />serial_same_as_valve</label>
        <div className='md:col-span-2'><Label>Action</Label><div className='flex gap-2'><Input list='actuator-action-options' disabled={!editing} value={form.actuator.action} onChange={(e) => setForm((p) => ({ ...p, actuator: { ...p.actuator, action: e.target.value } }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('actuator_action', form.actuator.action) }}>Kaydet</Button></div><datalist id='actuator-action-options'>{options.actuator_action.map((v) => <option key={v} value={v} />)}</datalist></div>
      </div>
    </section>

    <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 space-y-3'>
      <div className='flex items-center justify-between'><h2 className='text-lg font-semibold'>Accessories</h2><div className='flex w-full max-w-sm gap-2'><Input disabled={!editing} value={newAccessoryKey} onChange={(e) => setNewAccessoryKey(e.target.value)} placeholder='Listede yoksa yeni accessory ekle' /><Button disabled={!editing} variant='secondary' onClick={() => { void addCustomAccessory() }}>Ekle</Button></div></div>
      {form.accessories.map((a, idx) => <div key={a.key} className='rounded-xl border border-slate-200 p-3'><label className='mb-2 flex items-center gap-2 text-sm font-medium'><input disabled={!editing} type='checkbox' checked={a.installed} onChange={(e) => setForm((p) => ({ ...p, accessories: p.accessories.map((x, i) => i === idx ? { ...x, installed: e.target.checked } : x) }))} />{a.key}</label>{a.installed && <div className='grid gap-2 md:grid-cols-2'><div className='flex gap-2'><Input list='acc-brand-options' disabled={!editing} placeholder='brand' value={a.brand} onChange={(e) => setForm((p) => ({ ...p, accessories: p.accessories.map((x, i) => i === idx ? { ...x, brand: e.target.value } : x) }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('accessory_brand', a.brand) }}>Kaydet</Button></div><datalist id='acc-brand-options'>{options.accessory_brand.map((v) => <option key={v} value={v} />)}</datalist><div className='flex gap-2'><Input list='acc-model-options' disabled={!editing} placeholder='model' value={a.model} onChange={(e) => setForm((p) => ({ ...p, accessories: p.accessories.map((x, i) => i === idx ? { ...x, model: e.target.value } : x) }))} /><Button disabled={!editing} onClick={() => { void saveSingleOption('accessory_model', a.model) }}>Kaydet</Button></div><datalist id='acc-model-options'>{options.accessory_model.map((v) => <option key={v} value={v} />)}</datalist><Input disabled={!editing} placeholder='serial_no' value={a.serial_no} onChange={(e) => setForm((p) => ({ ...p, accessories: p.accessories.map((x, i) => i === idx ? { ...x, serial_no: e.target.value } : x) }))} /><Input disabled={!editing} placeholder='notes' value={a.notes} onChange={(e) => setForm((p) => ({ ...p, accessories: p.accessories.map((x, i) => i === idx ? { ...x, notes: e.target.value } : x) }))} /></div>}</div>)}
    </section>

    <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'><h2 className='mb-3 text-lg font-semibold'>Kayıtlı Ürünler</h2>{rows.length === 0 ? <p className='text-sm text-slate-500'>Kayıt yok</p> : <div className='space-y-2'>{rows.map((r) => <div key={r.id} className='flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm'><div>{r.type || '-'} · {r.serial_no || '-'} · {r.tag_no || '-'}</div><div className='flex gap-2'><Button variant='secondary' onClick={() => { void openExisting(r.id) }}>Düzenle</Button><Button variant='ghost' onClick={() => { void deleteProduct(r.id) }}>Sil</Button></div></div>)}</div>}</section>
  </div>
}

type CrudField = { key: string; label: string }

function SimpleCrudPage({ title, endpoint, fields }: { title: string; endpoint: string; fields: CrudField[] }) {
  const { t } = useI18n()
  const [rows, setRows] = React.useState<any[]>([])
  const [form, setForm] = React.useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.key, ''])))

  const load = React.useCallback(async () => {
    try {
      setRows(await api<any[]>(endpoint))
    } catch {
      setRows([])
    }
  }, [endpoint])

  React.useEffect(() => { void load() }, [load])

  const create = async () => {
    await api(endpoint, { method: 'POST', body: JSON.stringify(form) })
    setForm(Object.fromEntries(fields.map((f) => [f.key, ''])))
    toast.success(t('save'))
    await load()
  }

  return <div className='space-y-6'><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'><h1 className='mb-4 text-2xl font-semibold'>{title}</h1><div className='grid gap-3 md:grid-cols-2'>{fields.map((f) => <div key={f.key}><Label>{f.label}</Label><Input value={form[f.key] || ''} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} /></div>)}</div><Button className='mt-4' onClick={() => { void create() }}>{t('create')}</Button></section><section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70'>{rows.length === 0 ? <p className='text-sm text-slate-500'>{t('empty')}</p> : rows.map((r) => <div key={r.id} className='mb-2 rounded-xl border border-slate-200 p-3 text-sm'>{fields.map((f) => r[f.key]).filter(Boolean).join(' · ') || r.id}</div>)}</section></div>
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
  return <I18nContext.Provider value={{ lang, setLang, t }}><BrowserRouter><Shell><Routes><Route path='/' element={<Navigate to='/dashboard' replace />} /><Route path='/dashboard' element={<DashboardPage />} /><Route path='/customers' element={<CustomersPage />} /><Route path='/products' element={<ProductsPage />} /><Route path='/reports' element={<ReportsPage />} /><Route path='/reports/new' element={<ReportWizardPage />} /><Route path='/templates' element={<ActionLibraryPage />} /><Route path='/issuers' element={<IssuersReportsPage />} /><Route path='/exports' element={<ExportsPage />} /><Route path='/settings' element={<SettingsPage />} /></Routes></Shell></BrowserRouter></I18nContext.Provider>
}

createRoot(document.getElementById('root')!).render(<App />)
