-- ============================================================
-- Sistema de Requisição de Materiais — Esquema MVP (Supabase)
-- Cole tudo no SQL Editor do Supabase, na ordem abaixo.
-- ============================================================

-- 1. TABELAS -------------------------------------------------

create table materiais (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  unidade text not null,
  saldo integer not null default 0 check (saldo >= 0),
  estoque_min integer not null default 0 check (estoque_min >= 0),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table requisicoes (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references materiais(id),
  solicitante_id uuid not null references auth.users(id),
  quantidade integer not null check (quantidade > 0),
  status text not null default 'pendente'
    check (status in ('pendente','aprovada','recusada','entregue')),
  justificativa text,
  criado_em timestamptz not null default now(),
  resolvido_em timestamptz,
  resolvido_por uuid references auth.users(id)
);

create index idx_requisicoes_status on requisicoes(status);
create index idx_requisicoes_solicitante on requisicoes(solicitante_id);

-- 2. FUNÇÕES -------------------------------------------------

-- Verifica se o usuário autenticado é admin (perfil no user_metadata)
create or replace function is_admin()
returns boolean language sql stable as $$
  select coalesce((auth.jwt() -> 'user_metadata' ->> 'perfil') = 'admin', false)
$$;

-- Baixa atômica: entrega a requisição e decrementa o saldo
create or replace function entregar_requisicao(p_requisicao_id uuid)
returns void language plpgsql security definer as $$
declare
  req record;
begin
  if not is_admin() then
    raise exception 'Apenas administradores podem registrar entregas';
  end if;

  select * into req from requisicoes where id = p_requisicao_id for update;
  if not found then raise exception 'Requisição não encontrada'; end if;
  if req.status <> 'aprovada' then
    raise exception 'Só é possível entregar requisições aprovadas';
  end if;

  update materiais set saldo = saldo - req.quantidade
    where id = req.material_id and saldo >= req.quantidade;
  if not found then
    raise exception 'Saldo insuficiente';
  end if;

  update requisicoes set status = 'entregue',
    resolvido_em = now(), resolvido_por = auth.uid()
    where id = p_requisicao_id;
end $$;

-- 3. ROW LEVEL SECURITY --------------------------------------

alter table materiais enable row level security;
alter table requisicoes enable row level security;

-- materiais: todos autenticados leem; só admin escreve
create policy "leitura materiais" on materiais
  for select to authenticated using (true);

create policy "escrita admin materiais" on materiais
  for all to authenticated using (is_admin()) with check (is_admin());

-- requisições: usuário lê as próprias; admin lê todas
create policy "leitura requisicoes" on requisicoes
  for select to authenticated
  using (solicitante_id = auth.uid() or is_admin());

-- criação: qualquer autenticado, material ativo, saldo suficiente
create policy "criar requisicao" on requisicoes
  for insert to authenticated
  with check (
    solicitante_id = auth.uid()
    and status = 'pendente'
    and exists (
      select 1 from materiais m
      where m.id = material_id and m.ativo and m.saldo >= quantidade
    )
  );

-- update: apenas admin (aprovar/recusar/entregar)
create policy "admin gerencia requisicoes" on requisicoes
  for update to authenticated using (is_admin()) with check (is_admin());

-- 4. PÓS-SETUP MANUAL (não executar aqui) --------------------
-- Após criar o primeiro usuário em Authentication → Users:
-- edite o usuário e defina no User Metadata: {"perfil": "admin"}
-- Os demais usuários ficam como solicitantes (padrão).
