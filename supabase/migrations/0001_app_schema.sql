-- ============================================================
-- Ringly — Supabase Postgres Schema (V1)
-- Multi-tenant. Every tenant-scoped table carries tenant_id and
-- is protected by Row Level Security (RLS policy at the bottom).
-- ============================================================

create extension if not exists vector; -- pgvector, for Knowledge Base embeddings

-- ============================================================
-- TENANTS & IDENTITY
-- ============================================================

create type business_type as enum ('service', 'product');

create table tenants (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  business_type business_type not null,
  description text,
  industry text,
  logo_url text,
  timezone text not null default 'UTC',
  currency text not null default 'USD',
  support_email text,
  support_phone text,
  website_url text,
  social_links jsonb default '{}',
  address text, -- Service type only, enforced in app layer
  created_at timestamptz not null default now()
);

-- Note: tenants.id is set explicitly to the owner's auth.uid() at
-- signup time (not left to the default) — one owner per tenant for
-- V1, no separate user/team mapping table needed. If a team feature
-- is added later, reintroduce a profiles-style mapping table and
-- update auth_tenant_id() below; no other policy needs to change.

create table business_hours (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  open_time time,
  close_time time,
  is_closed boolean not null default false,
  unique (tenant_id, day_of_week)
);

create table business_hour_exceptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  exception_date date not null,
  label text,
  is_closed boolean not null default true
);

-- ============================================================
-- AGENT PERSONA
-- ============================================================

create type response_length as enum ('concise', 'detailed');
create type agent_tone as enum ('formal', 'friendly', 'casual', 'playful');

create table agent_persona (
  tenant_id uuid primary key references tenants(id) on delete cascade,
  display_name text not null default 'Assistant',
  avatar_url text,
  tone agent_tone not null default 'friendly',
  greeting_message text,
  signoff_message text,
  use_emoji boolean not null default false,
  response_length response_length not null default 'concise',
  fallback_message text,
  banned_terms text[] default '{}'
);

-- ============================================================
-- OFFERINGS (Service type)
-- ============================================================

create table staff (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  is_active boolean not null default true
);

create table services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes int not null,
  price numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table service_staff (
  service_id uuid references services(id) on delete cascade,
  staff_id uuid references staff(id) on delete cascade,
  primary key (service_id, staff_id)
);

-- ============================================================
-- OFFERINGS (Product type)
-- ============================================================

create table products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  stock_quantity int not null default 0,
  low_stock_threshold int not null default 5,
  category text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- POLICIES & ESCALATION
-- ============================================================

create table policies (
  tenant_id uuid primary key references tenants(id) on delete cascade,
  cancellation_policy text,
  refund_policy text, -- Product type only, enforced in app layer
  escalation_notify_target text -- e.g. 'owner' or a specific contact
);

create type escalation_trigger_type as enum (
  'refund_request', 'angry_customer', 'cant_answer', 'asks_for_human', 'custom'
);

create table escalation_triggers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  trigger_type escalation_trigger_type not null,
  custom_phrase text, -- only set when trigger_type = 'custom'
  is_enabled boolean not null default true
);

-- ============================================================
-- KNOWLEDGE BASE
-- ============================================================

create table kb_faqs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  question text not null,
  answer text not null,
  usage_count int not null default 0, -- powers "most-used FAQ" analytics
  created_at timestamptz not null default now()
);

create type kb_source_status as enum ('pending', 'processed', 'failed');
create type kb_source_type as enum ('upload', 'paste');

create table kb_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  source_type kb_source_type not null,
  file_url text,       -- set when source_type = 'upload'
  raw_text text,        -- set when source_type = 'paste'
  status kb_source_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Chunked + embedded content, from either FAQs or documents, used for RAG retrieval.
create table kb_embeddings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  source_document_id uuid references kb_documents(id) on delete cascade,
  content text not null,
  embedding vector(1536), -- adjust dimensions to match your embedding model
  metadata jsonb default '{}'
);

create index on kb_embeddings using ivfflat (embedding vector_cosine_ops);

-- ============================================================
-- CONTACTS
-- ============================================================

create table contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  phone text not null,
  name text,
  first_contact_at timestamptz not null default now(),
  last_contact_at timestamptz not null default now(),
  is_blocked boolean not null default false,
  notes text,
  unique (tenant_id, phone)
);

-- ============================================================
-- CONVERSATIONS & MESSAGES
-- ============================================================

create type conversation_status as enum ('agent', 'human', 'resolved');

create table conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  status conversation_status not null default 'agent',
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  handed_off_at timestamptz,          -- set the moment "Take over" fires; null = never escalated
  handoff_trigger escalation_trigger_type -- which trigger caused it, if any
);

create type message_sender as enum ('customer', 'agent', 'human_staff');

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_type message_sender not null,
  content text not null,
  is_internal_note boolean not null default false,
  used_faq_id uuid references kb_faqs(id), -- set when agent answers from a specific FAQ
  created_at timestamptz not null default now()
);

-- ============================================================
-- BOOKINGS (Service type)
-- ============================================================

create type booking_status as enum ('upcoming', 'completed', 'cancelled');

create table bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  service_id uuid not null references services(id),
  staff_id uuid references staff(id),
  scheduled_at timestamptz not null,
  duration_minutes int not null,
  status booking_status not null default 'upcoming',
  created_via text not null default 'agent', -- 'agent' or 'manual'
  created_at timestamptz not null default now()
);

-- ============================================================
-- ORDERS (Product type)
-- ============================================================

create type order_status as enum ('pending', 'confirmed', 'fulfilled', 'cancelled');

create table orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  status order_status not null default 'pending',
  total_amount numeric(10,2) not null default 0,
  created_via text not null default 'agent',
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity int not null,
  unit_price numeric(10,2) not null
);

-- ============================================================
-- BROADCASTS
-- ============================================================

create type broadcast_status as enum ('draft', 'scheduled', 'sent');

create table broadcasts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  message_template text not null,
  -- V1: always all contacts, no segment filtering
  scheduled_at timestamptz,
  sent_at timestamptz,
  status broadcast_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table broadcast_recipients (
  id uuid primary key default gen_random_uuid(),
  broadcast_id uuid not null references broadcasts(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  delivered boolean not null default false,
  read boolean not null default false
);

-- ============================================================
-- CHANNEL & BILLING
-- ============================================================

create type whatsapp_status as enum ('connected', 'disconnected', 'issue');

create table whatsapp_connections (
  tenant_id uuid primary key references tenants(id) on delete cascade,
  phone_number text,
  meta_account_id text,
  status whatsapp_status not null default 'disconnected',
  connected_at timestamptz
);

create table subscriptions (
  tenant_id uuid primary key references tenants(id) on delete cascade,
  plan_name text not null default 'free',
  status text not null default 'active',
  lemon_squeezy_customer_id text,
  current_period_end timestamptz
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Pattern: every tenant-scoped table only allows rows where
-- tenant_id matches the caller's own id (tenant id = owner's
-- auth user id, set explicitly at signup — see note above).
-- Repeat this pattern for every table above — shown here once
-- as the template to apply table by table.
-- ============================================================

create or replace function auth_tenant_id()
returns uuid
language sql stable
as $$
  select auth.uid()
$$;

alter table tenants enable row level security;
create policy tenant_isolation on tenants
  for all using (id = auth_tenant_id());

alter table contacts enable row level security;
create policy tenant_isolation on contacts
  for all using (tenant_id = auth_tenant_id());

-- Direct tenant_id (or tenant_id-as-primary-key) tables — same
-- one-line pattern as tenants/contacts above.

alter table business_hours enable row level security;
create policy tenant_isolation on business_hours
  for all using (tenant_id = auth_tenant_id());

alter table business_hour_exceptions enable row level security;
create policy tenant_isolation on business_hour_exceptions
  for all using (tenant_id = auth_tenant_id());

alter table agent_persona enable row level security;
create policy tenant_isolation on agent_persona
  for all using (tenant_id = auth_tenant_id());

alter table staff enable row level security;
create policy tenant_isolation on staff
  for all using (tenant_id = auth_tenant_id());

alter table services enable row level security;
create policy tenant_isolation on services
  for all using (tenant_id = auth_tenant_id());

alter table products enable row level security;
create policy tenant_isolation on products
  for all using (tenant_id = auth_tenant_id());

alter table policies enable row level security;
create policy tenant_isolation on policies
  for all using (tenant_id = auth_tenant_id());

alter table escalation_triggers enable row level security;
create policy tenant_isolation on escalation_triggers
  for all using (tenant_id = auth_tenant_id());

alter table kb_faqs enable row level security;
create policy tenant_isolation on kb_faqs
  for all using (tenant_id = auth_tenant_id());

alter table kb_documents enable row level security;
create policy tenant_isolation on kb_documents
  for all using (tenant_id = auth_tenant_id());

alter table kb_embeddings enable row level security;
create policy tenant_isolation on kb_embeddings
  for all using (tenant_id = auth_tenant_id());

alter table conversations enable row level security;
create policy tenant_isolation on conversations
  for all using (tenant_id = auth_tenant_id());

alter table bookings enable row level security;
create policy tenant_isolation on bookings
  for all using (tenant_id = auth_tenant_id());

alter table orders enable row level security;
create policy tenant_isolation on orders
  for all using (tenant_id = auth_tenant_id());

alter table broadcasts enable row level security;
create policy tenant_isolation on broadcasts
  for all using (tenant_id = auth_tenant_id());

alter table whatsapp_connections enable row level security;
create policy tenant_isolation on whatsapp_connections
  for all using (tenant_id = auth_tenant_id());

alter table subscriptions enable row level security;
create policy tenant_isolation on subscriptions
  for all using (tenant_id = auth_tenant_id());

-- Join/child tables with no tenant_id column of their own — these
-- check ownership by looking through their parent row instead.

alter table service_staff enable row level security;
create policy tenant_isolation on service_staff
  for all using (
    exists (
      select 1 from services
      where services.id = service_staff.service_id
      and services.tenant_id = auth_tenant_id()
    )
  );

alter table messages enable row level security;
create policy tenant_isolation on messages
  for all using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.tenant_id = auth_tenant_id()
    )
  );

alter table order_items enable row level security;
create policy tenant_isolation on order_items
  for all using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.tenant_id = auth_tenant_id()
    )
  );

alter table broadcast_recipients enable row level security;
create policy tenant_isolation on broadcast_recipients
  for all using (
    exists (
      select 1 from broadcasts
      where broadcasts.id = broadcast_recipients.broadcast_id
      and broadcasts.tenant_id = auth_tenant_id()
    )
  );