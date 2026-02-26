from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class StrictModel(BaseModel):
    model_config = ConfigDict(extra='forbid')


class CustomerIn(StrictModel):
    name: str
    tax_no: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    shipping_address: str | None = None


class ContactIn(StrictModel):
    customer_id: str
    name: str
    email: str | None = None
    phone: str | None = None
    title: str | None = None
    department: str | None = None
    is_default: bool = False


class BrandIn(StrictModel):
    name: str


class ModelIn(StrictModel):
    brand_id: str
    name: str


class AccessoryIn(StrictModel):
    key: str
    installed: bool = False
    brand: str | None = None
    model: str | None = None
    serial_no: str | None = None
    notes: str | None = None


class ActuatorIn(StrictModel):
    type: str | None = None
    brand: str | None = None
    model: str | None = None
    serial_no: str | None = None
    action: str | None = None
    model_same_as_valve: bool = False
    serial_same_as_valve: bool = False


class ProductIn(StrictModel):
    customer_id: str
    brand_id: str
    model_id: str
    type: str
    serial_no: str | None = None
    tag_no: str | None = None
    dn_pn: str | None = None
    notes: str | None = None
    technical_card: dict = Field(default_factory=dict)

    valve_type: str | None = None
    manufacturer: str | None = None
    size: str | None = None
    pressure_class: str | None = None
    connection_type: str | None = None
    body_style: str | None = None
    fail_action: str | None = None

    body_material: str | None = None
    trim_material: str | None = None
    seat_material: str | None = None
    stem_material: str | None = None

    actuator: ActuatorIn | None = None
    accessories: list[AccessoryIn] = Field(default_factory=list)


class ReportActionItem(StrictModel):
    library_id: str | None = None
    snapshot_text_tr: str
    snapshot_text_en: str
    manual_extension_tr: str = ''
    manual_extension_en: str = ''
    final_text_tr: str = ''
    final_text_en: str = ''
    order_index: int = 0


class ReportIn(StrictModel):
    language: Literal['tr', 'en'] = 'tr'
    status: Literal['draft', 'pre_report', 'quotation_sent', 'awaiting_approval', 'approved', 'in_service', 'final_report', 'archived'] = 'draft'
    revision_no: int = 1
    customer_id: str
    issuer_id: str | None = None
    contact_id: str | None = None
    responsible_user: str
    last_check_by: str | None = None
    arrival_date: datetime | None = None
    shipping_date: datetime | None = None
    warranty_status: str | None = None
    demart_authority: str | None = None
    products: list[dict] = Field(default_factory=list)
    blocks: dict = Field(default_factory=dict)
    actions: list[ReportActionItem] = Field(default_factory=list)
    accessory_notes: list[dict] = Field(default_factory=list)
    spares: list[dict] = Field(default_factory=list)
    result_notes: str | None = None
    internal_notes: str | None = None


class TemplateIn(StrictModel):
    type: Literal['action', 'problem', 'complaint']
    title: str
    language: Literal['tr', 'en', 'both'] = 'tr'
    text: str


class ActionLibraryIn(StrictModel):
    scope: str
    valve_type: str | None = None
    category: str
    order_index: int = 0
    title_tr: str
    title_en: str
    text_tr: str
    text_en: str
    is_active: bool = True
    created_by_user: str | None = None


class CompanyProfileIn(StrictModel):
    name: str
    legal_company_name: str | None = None
    legal_text: str | None = None
    legal_notes: list[str] = Field(default_factory=list)
    address: str | None = None
    phone: str | None = None
    email: str | None = None
    signature_labels: dict = Field(default_factory=dict)
    logo_object_key: str | None = None
    is_default: bool = False


class ExportOptionsIn(StrictModel):
    photos_per_page: Literal[4, 6, 8] = 6
    quality: Literal['standard', 'high'] = 'standard'
    language: Literal['tr', 'en'] = 'tr'


class ExcelExportOptionsIn(StrictModel):
    type: Literal['external', 'internal'] = 'external'
    language: Literal['tr', 'en'] = 'tr'
