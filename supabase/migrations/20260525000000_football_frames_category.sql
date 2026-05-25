-- Adds a product category column and extends contact_submissions to capture
-- custom-frame inquiries (intent + structured brief in meta JSONB).

alter table products
  add column if not exists category text not null default 'diecast'
    check (category in ('diecast', 'football'));

create index if not exists products_category_idx on products(category);

alter table contact_submissions
  add column if not exists intent text not null default 'general',
  add column if not exists meta jsonb;

create index if not exists contact_submissions_intent_idx on contact_submissions(intent);
