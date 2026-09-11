-- DraBornGo / LastMile v0.7.4 seasonal payment gate.
create table if not exists "Last-Mile".dkd_lastmile_payment_accounts (
  dkd_id text primary key, dkd_label text not null, dkd_bank_name text not null, dkd_account_holder text not null,
  dkd_iban text not null, dkd_is_active boolean not null default true, dkd_sort integer not null default 0,
  dkd_updated_by uuid, dkd_created_at timestamptz not null default now(), dkd_updated_at timestamptz not null default now()
);
create table if not exists "Last-Mile".dkd_lastmile_season_payment_options (
  dkd_id text primary key, dkd_season_id text not null references "Last-Mile".dkd_lastmile_seasons(dkd_id) on delete cascade,
  dkd_account_id text not null references "Last-Mile".dkd_lastmile_payment_accounts(dkd_id), dkd_name text not null,
  dkd_amount numeric(12,2) not null check(dkd_amount>=0), dkd_currency text not null default 'TRY', dkd_description text not null default '',
  dkd_is_active boolean not null default true, dkd_sort integer not null default 0, dkd_created_at timestamptz not null default now(), dkd_updated_at timestamptz not null default now()
);
create table if not exists "Last-Mile".dkd_lastmile_season_payments (
  dkd_id uuid primary key default gen_random_uuid(), dkd_user_id uuid not null, dkd_season_id text not null references "Last-Mile".dkd_lastmile_seasons(dkd_id),
  dkd_option_id text not null references "Last-Mile".dkd_lastmile_season_payment_options(dkd_id), dkd_amount numeric(12,2) not null,
  dkd_currency text not null default 'TRY', dkd_receipt_path text not null default 'database://receipt', dkd_receipt_data text,
  dkd_note text not null default '', dkd_status text not null default 'pending' check(dkd_status in ('pending','approved','rejected')),
  dkd_submitted_at timestamptz not null default now(), dkd_reviewed_at timestamptz, dkd_reviewed_by uuid, dkd_review_note text not null default '', dkd_updated_at timestamptz not null default now()
);
create index if not exists dkd_lastmile_season_payments_user_idx on "Last-Mile".dkd_lastmile_season_payments(dkd_user_id,dkd_season_id,dkd_submitted_at desc);
create index if not exists dkd_lastmile_season_payments_status_idx on "Last-Mile".dkd_lastmile_season_payments(dkd_status,dkd_submitted_at desc);
create unique index if not exists dkd_lastmile_one_open_payment_idx on "Last-Mile".dkd_lastmile_season_payments(dkd_user_id,dkd_season_id) where dkd_status in ('pending','approved');

insert into "Last-Mile".dkd_lastmile_payment_accounts(dkd_id,dkd_label,dkd_bank_name,dkd_account_holder,dkd_iban,dkd_sort)
values('dkd_main_iban','Ana sezon hesabı','ÖRNEK BANKA','DraBorn Games','TR00 0000 0000 0000 0000 0000 00',10) on conflict(dkd_id) do nothing;
insert into "Last-Mile".dkd_lastmile_season_payment_options(dkd_id,dkd_season_id,dkd_account_id,dkd_name,dkd_amount,dkd_description,dkd_sort) values
('dkd_s01_havale','dkd_season01','dkd_main_iban','Sezon 1 · Havale / EFT',499,'Büyük Fırtına sezon erişimi · örnek test fiyatı',10),
('dkd_s02_havale','dkd_season02','dkd_main_iban','Sezon 2 · Havale / EFT',549,'Geceye Uyanan Şehir sezon erişimi · örnek test fiyatı',20),
('dkd_s03_havale','dkd_season03','dkd_main_iban','Sezon 3 · Havale / EFT',599,'Sıcak Dalgası sezon erişimi · örnek test fiyatı',30),
('dkd_s04_havale','dkd_season04','dkd_main_iban','Sezon 4 · Havale / EFT',649,'Karanlık Şehir sezon erişimi · örnek test fiyatı',40)
on conflict(dkd_id) do nothing;

create or replace function public.dkd_lastmile_payment_bootstrap(dkd_user_id uuid) returns jsonb language plpgsql security definer set search_path to '' as $$
declare dkd_is_admin boolean:=false; dkd_current_season_id text; dkd_payment jsonb;
begin
 select coalesce(dkd_role='admin',false) into dkd_is_admin from "Last-Mile".dkd_lastmile_profiles where dkd_user_id=$1 and dkd_is_active=true;
 select dkd_id into dkd_current_season_id from "Last-Mile".dkd_lastmile_seasons where dkd_is_active and now() between dkd_starts_at and dkd_ends_at order by dkd_number limit 1;
 select to_jsonb(dkd_row) into dkd_payment from (select p.dkd_id,p.dkd_season_id,p.dkd_option_id,p.dkd_amount,p.dkd_currency,p.dkd_note,p.dkd_status,p.dkd_submitted_at,p.dkd_reviewed_at,p.dkd_review_note from "Last-Mile".dkd_lastmile_season_payments p where p.dkd_user_id=$1 and p.dkd_season_id=dkd_current_season_id order by p.dkd_submitted_at desc limit 1) dkd_row;
 return jsonb_build_object('dkd_enforced',not dkd_is_admin,'dkd_is_admin',dkd_is_admin,'dkd_current_season_id',dkd_current_season_id,'dkd_payment',dkd_payment,
 'dkd_accounts',coalesce((select jsonb_agg(to_jsonb(a) order by a.dkd_sort) from "Last-Mile".dkd_lastmile_payment_accounts a where a.dkd_is_active),'[]'::jsonb),
 'dkd_options',coalesce((select jsonb_agg(to_jsonb(o) order by o.dkd_sort) from "Last-Mile".dkd_lastmile_season_payment_options o where o.dkd_is_active),'[]'::jsonb),
 'dkd_seasons',coalesce((select jsonb_agg(to_jsonb(s) order by s.dkd_number) from "Last-Mile".dkd_lastmile_seasons s where s.dkd_is_active),'[]'::jsonb));
end $$;

create or replace function public.dkd_lastmile_payment_submit_data(dkd_user_id uuid,dkd_option_id text,dkd_receipt_data text,dkd_note text) returns jsonb language plpgsql security definer set search_path to '' as $$
declare dkd_option "Last-Mile".dkd_lastmile_season_payment_options%rowtype; dkd_payment "Last-Mile".dkd_lastmile_season_payments%rowtype;
begin
 if length(coalesce($3,''))>4200000 or coalesce($3,'')!~'^data:image/(jpeg|png|webp);base64,' then raise exception 'receipt_invalid_or_too_large'; end if;
 select * into dkd_option from "Last-Mile".dkd_lastmile_season_payment_options where dkd_id=$2 and dkd_is_active=true;
 if dkd_option.dkd_id is null then raise exception 'payment_option_not_found'; end if;
 if not exists(select 1 from "Last-Mile".dkd_lastmile_seasons where dkd_id=dkd_option.dkd_season_id and dkd_is_active and now() between dkd_starts_at and dkd_ends_at) then raise exception 'season_not_current'; end if;
 if exists(select 1 from "Last-Mile".dkd_lastmile_season_payments where dkd_user_id=$1 and dkd_season_id=dkd_option.dkd_season_id and dkd_status in('pending','approved')) then raise exception 'payment_already_submitted'; end if;
 insert into "Last-Mile".dkd_lastmile_season_payments(dkd_user_id,dkd_season_id,dkd_option_id,dkd_amount,dkd_currency,dkd_receipt_data,dkd_note) values($1,dkd_option.dkd_season_id,dkd_option.dkd_id,dkd_option.dkd_amount,dkd_option.dkd_currency,left($3,4200000),left(coalesce($4,''),1000)) returning * into dkd_payment;
 return to_jsonb(dkd_payment)-'dkd_receipt_data';
end $$;

create or replace function public.dkd_lastmile_admin_payments(dkd_admin_user_id uuid) returns jsonb language plpgsql security definer set search_path to '' as $$
begin
 if not exists(select 1 from "Last-Mile".dkd_lastmile_profiles where dkd_user_id=$1 and dkd_role='admin' and dkd_is_active) then raise exception 'admin_required'; end if;
 return jsonb_build_object('dkd_payments',coalesce((select jsonb_agg(jsonb_build_object('dkd_id',p.dkd_id,'dkd_full_name',pr.dkd_full_name,'dkd_company_name',pr.dkd_company_name,'dkd_email',pr.dkd_email,'dkd_season_id',p.dkd_season_id,'dkd_amount',p.dkd_amount,'dkd_currency',p.dkd_currency,'dkd_receipt_data',p.dkd_receipt_data,'dkd_note',p.dkd_note,'dkd_status',p.dkd_status,'dkd_submitted_at',p.dkd_submitted_at,'dkd_review_note',p.dkd_review_note) order by p.dkd_submitted_at desc) from "Last-Mile".dkd_lastmile_season_payments p left join "Last-Mile".dkd_lastmile_profiles pr on pr.dkd_user_id=p.dkd_user_id),'[]'::jsonb),'dkd_settings',public.dkd_lastmile_payment_bootstrap($1));
end $$;
create or replace function public.dkd_lastmile_admin_payment_review(dkd_admin_user_id uuid,dkd_payment_id uuid,dkd_status text,dkd_review_note text) returns jsonb language plpgsql security definer set search_path to '' as $$
declare dkd_row "Last-Mile".dkd_lastmile_season_payments%rowtype;
begin
 if not exists(select 1 from "Last-Mile".dkd_lastmile_profiles where dkd_user_id=$1 and dkd_role='admin' and dkd_is_active) then raise exception 'admin_required'; end if;
 if $3 not in('approved','rejected') then raise exception 'invalid_payment_status'; end if;
 update "Last-Mile".dkd_lastmile_season_payments set dkd_status=$3,dkd_review_note=left(coalesce($4,''),1000),dkd_reviewed_at=now(),dkd_reviewed_by=$1,dkd_updated_at=now() where dkd_id=$2 returning * into dkd_row;
 if dkd_row.dkd_id is null then raise exception 'payment_not_found'; end if; return to_jsonb(dkd_row)-'dkd_receipt_data';
end $$;
create or replace function public.dkd_lastmile_admin_payment_account_save(dkd_admin_user_id uuid,dkd_account_id text,dkd_bank_name text,dkd_account_holder text,dkd_iban text) returns jsonb language plpgsql security definer set search_path to '' as $$
declare dkd_row "Last-Mile".dkd_lastmile_payment_accounts%rowtype;
begin
 if not exists(select 1 from "Last-Mile".dkd_lastmile_profiles where dkd_user_id=$1 and dkd_role='admin' and dkd_is_active) then raise exception 'admin_required'; end if;
 update "Last-Mile".dkd_lastmile_payment_accounts set dkd_bank_name=left(trim(coalesce($3,'')),80),dkd_account_holder=left(trim(coalesce($4,'')),100),dkd_iban=left(upper(trim(coalesce($5,''))),40),dkd_updated_by=$1,dkd_updated_at=now() where dkd_id=$2 returning * into dkd_row;
 if dkd_row.dkd_id is null then raise exception 'payment_account_not_found'; end if; return to_jsonb(dkd_row);
end $$;
create or replace function public.dkd_lastmile_admin_payment_option_save(dkd_admin_user_id uuid,dkd_option_id text,dkd_amount numeric,dkd_description text) returns jsonb language plpgsql security definer set search_path to '' as $$
declare dkd_row "Last-Mile".dkd_lastmile_season_payment_options%rowtype;
begin
 if not exists(select 1 from "Last-Mile".dkd_lastmile_profiles where dkd_user_id=$1 and dkd_role='admin' and dkd_is_active) then raise exception 'admin_required'; end if;
 update "Last-Mile".dkd_lastmile_season_payment_options set dkd_amount=greatest(0,$3),dkd_description=left(coalesce($4,''),300),dkd_updated_at=now() where dkd_id=$2 returning * into dkd_row;
 if dkd_row.dkd_id is null then raise exception 'payment_option_not_found'; end if; return to_jsonb(dkd_row);
end $$;

do $$ begin
 if to_regprocedure('public.dkd_lastmile_bootstrap_v073(uuid)') is null then alter function public.dkd_lastmile_bootstrap(uuid) rename to dkd_lastmile_bootstrap_v073; end if;
 if to_regprocedure('public.dkd_lastmile_claim_job_v073(uuid,integer)') is null then alter function public.dkd_lastmile_claim_job(uuid,integer) rename to dkd_lastmile_claim_job_v073; end if;
 if to_regprocedure('public.dkd_lastmile_complete_job_v073(uuid,uuid,jsonb)') is null then alter function public.dkd_lastmile_complete_job(uuid,uuid,jsonb) rename to dkd_lastmile_complete_job_v073; end if;
 if to_regprocedure('public.dkd_lastmile_accept_job_v073(uuid,uuid)') is null then alter function public.dkd_lastmile_accept_job(uuid,uuid) rename to dkd_lastmile_accept_job_v073; end if;
 if to_regprocedure('public.dkd_lastmile_cancel_job_v073(uuid,uuid,text)') is null then alter function public.dkd_lastmile_cancel_job(uuid,uuid,text) rename to dkd_lastmile_cancel_job_v073; end if;
end $$;
create or replace function public.dkd_lastmile_bootstrap(dkd_user_id uuid) returns jsonb language plpgsql security definer set search_path to '' as $$ declare dkd_data jsonb; begin dkd_data:=public.dkd_lastmile_bootstrap_v073($1); return jsonb_set(jsonb_set(dkd_data,'{dkd_version}','"0.7.4"'::jsonb,true),'{dkd_payment_center}',public.dkd_lastmile_payment_bootstrap($1),true); end $$;
create or replace function public.dkd_lastmile_claim_job(dkd_user_id uuid,dkd_level integer) returns jsonb language plpgsql security definer set search_path to '' as $$ begin if $2=974 then return jsonb_build_object('dkd_v074_admin_payments',true)||public.dkd_lastmile_admin_payments($1); end if; return public.dkd_lastmile_claim_job_v073($1,$2); end $$;
create or replace function public.dkd_lastmile_complete_job(dkd_user_id uuid,dkd_job_id uuid,dkd_metrics jsonb) returns jsonb language plpgsql security definer set search_path to '' as $$ declare dkd_action text:=coalesce($3->>'dkd_v074_action',''); begin if $2='00000000-0000-0000-0000-000000000974'::uuid then if dkd_action='payment_submit' then return public.dkd_lastmile_payment_submit_data($1,$3->>'dkd_option_id',$3->>'dkd_receipt_data',$3->>'dkd_note'); elsif dkd_action='admin_account_save' then return public.dkd_lastmile_admin_payment_account_save($1,$3->>'dkd_account_id',$3->>'dkd_bank_name',$3->>'dkd_account_holder',$3->>'dkd_iban'); elsif dkd_action='admin_option_save' then return public.dkd_lastmile_admin_payment_option_save($1,$3->>'dkd_option_id',greatest(0,coalesce(($3->>'dkd_amount')::numeric,0)),$3->>'dkd_description'); end if; raise exception 'unknown_v074_bridge_action'; end if; return public.dkd_lastmile_complete_job_v073($1,$2,$3); end $$;
create or replace function public.dkd_lastmile_accept_job(dkd_user_id uuid,dkd_job_id uuid) returns jsonb language plpgsql security definer set search_path to '' as $$ begin if exists(select 1 from "Last-Mile".dkd_lastmile_season_payments where dkd_id=$2 and dkd_status='pending') then return public.dkd_lastmile_admin_payment_review($1,$2,'approved',''); end if; return public.dkd_lastmile_accept_job_v073($1,$2); end $$;
create or replace function public.dkd_lastmile_cancel_job(dkd_user_id uuid,dkd_job_id uuid,dkd_reason text) returns jsonb language plpgsql security definer set search_path to '' as $$ begin if exists(select 1 from "Last-Mile".dkd_lastmile_season_payments where dkd_id=$2 and dkd_status='pending') then return public.dkd_lastmile_admin_payment_review($1,$2,'rejected',coalesce($3,'Dekont doğrulanamadı.')); end if; return public.dkd_lastmile_cancel_job_v073($1,$2,$3); end $$;

revoke all on function public.dkd_lastmile_payment_bootstrap(uuid) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_payment_submit_data(uuid,text,text,text) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_admin_payments(uuid) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_admin_payment_review(uuid,uuid,text,text) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_admin_payment_account_save(uuid,text,text,text,text) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_admin_payment_option_save(uuid,text,numeric,text) from public,anon,authenticated;
grant execute on function public.dkd_lastmile_payment_bootstrap(uuid),public.dkd_lastmile_payment_submit_data(uuid,text,text,text),public.dkd_lastmile_admin_payments(uuid),public.dkd_lastmile_admin_payment_review(uuid,uuid,text,text),public.dkd_lastmile_admin_payment_account_save(uuid,text,text,text,text),public.dkd_lastmile_admin_payment_option_save(uuid,text,numeric,text),public.dkd_lastmile_bootstrap(uuid),public.dkd_lastmile_claim_job(uuid,integer),public.dkd_lastmile_complete_job(uuid,uuid,jsonb),public.dkd_lastmile_accept_job(uuid,uuid),public.dkd_lastmile_cancel_job(uuid,uuid,text) to service_role;
