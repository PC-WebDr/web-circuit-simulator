-- Saved schematics. user_id is text to match Better Auth (and the preview dev user).
-- Ids are generated in the app (PGLite has no pgcrypto).

create table if not exists circuits (
  id text primary key,
  user_id text not null,
  name text not null,
  schematic_data jsonb not null,
  netlist_text text not null default '',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists circuits_user_id_idx on circuits (user_id);
create index if not exists circuits_public_idx on circuits (is_public, created_at desc);
