-- =====================================================================
-- SIM GKJ MIJEN - Skema Basis Data Supabase
-- Sesuai ERD di dokumen "Tahap Perancangan Proses Usulan, Basis Data, dan Laporan"
-- (Kelompok 1). Untuk project Supabase BARU: jalankan SEKALI di SQL Editor.
-- Setelah itu (opsional) jalankan seed.sql untuk data contoh.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. TABEL (6 tabel, PK UUID, snake_case, created_at & updated_at)
-- ---------------------------------------------------------------------

-- 1.1 profiles : akun login (Supabase Auth) + peran
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nama        text,
  email       text,
  peran       text not null default 'warga' check (peran in ('warga','pengurus')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 1.2 jemaat : data pribadi jemaat (1 akun mewakili 0..1 jemaat)
create table jemaat (
  id_jemaat      uuid primary key default gen_random_uuid(),
  id_profiles    uuid unique references profiles(id) on delete set null,
  nama           text not null,
  no_hp          text,
  alamat         text,
  data_keluarga  text,
  wilayah        text,
  status_baptis  boolean not null default false,
  status_sidi    boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 1.3 permohonan_surat : pengajuan surat baptis / sidi / atestasi
create table permohonan_surat (
  id_permohonan      uuid primary key default gen_random_uuid(),
  id_jemaat          uuid not null references jemaat(id_jemaat) on delete cascade,
  id_pengurus        uuid references profiles(id) on delete set null,
  jenis_surat        text not null check (jenis_surat in ('baptis','sidi','atestasi')),
  tanggal_pengajuan  date not null default current_date,
  status             text not null default 'diajukan'
                     check (status in ('diajukan','diproses','selesai','ditolak')),
  catatan            text,
  nomor_surat        text,
  keterangan         text,   -- isian form permohonan dari warga
  url_lampiran       text,   -- path berkas di bucket "lampiran"
  url_surat          text,   -- path berkas di bucket "surat"
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- 1.4 transaksi_keuangan : pemasukan & pengeluaran
create table transaksi_keuangan (
  id_transaksi     uuid primary key default gen_random_uuid(),
  id_profiles      uuid references profiles(id) on delete set null,  -- pencatat
  tanggal          date not null default current_date,
  jenis_transaksi  text not null check (jenis_transaksi in ('pemasukan','pengeluaran')),
  kategori         text not null,   -- mis. persembahan, operasional, diakonia
  nominal          numeric(15,2) not null check (nominal > 0),
  keterangan       text,
  bukti_url        text,            -- path berkas di bucket "bukti-transaksi"
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 1.5 kegiatan : jadwal kegiatan & petugas
create table kegiatan (
  id_kegiatan    uuid primary key default gen_random_uuid(),
  id_profiles    uuid references profiles(id) on delete set null,  -- pembuat
  nama_kegiatan  text not null,
  tanggal        date not null,
  jam            time,
  lokasi         text,
  petugas        text,
  url_poster     text,            -- URL publik di bucket "publik"
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 1.6 warta : warta jemaat (draf -> terbit)
create table warta (
  id_warta        uuid primary key default gen_random_uuid(),
  id_profiles     uuid references profiles(id) on delete set null,  -- penulis
  judul           text not null,
  isi             text,
  status          text not null default 'draf' check (status in ('draf','terbit')),
  tanggal_terbit  date,
  url_pdf         text,           -- URL publik di bucket "publik"
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index untuk pencarian/filter yang sering dipakai
create index on jemaat (wilayah);
create index on jemaat (nama);
create index on permohonan_surat (id_jemaat);
create index on permohonan_surat (status);
create index on transaksi_keuangan (tanggal);
create index on kegiatan (tanggal);
create index on warta (status, tanggal_terbit);


-- ---------------------------------------------------------------------
-- 2. FUNGSI & TRIGGER
-- ---------------------------------------------------------------------

-- 2.1 Cek apakah user yang login adalah pengurus
create or replace function is_pengurus() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and peran = 'pengurus'
  );
$$;

-- 2.2 updated_at otomatis
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated   before update on profiles           for each row execute function set_updated_at();
create trigger trg_jemaat_updated     before update on jemaat             for each row execute function set_updated_at();
create trigger trg_permohonan_updated before update on permohonan_surat   for each row execute function set_updated_at();
create trigger trg_transaksi_updated  before update on transaksi_keuangan for each row execute function set_updated_at();
create trigger trg_kegiatan_updated   before update on kegiatan           for each row execute function set_updated_at();
create trigger trg_warta_updated      before update on warta              for each row execute function set_updated_at();

-- 2.3 Saat user mendaftar (Supabase Auth) -> otomatis dibuatkan profiles (peran warga)
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, nama, peran)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'nama', new.email), 'warga');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 2.4 Warga tidak boleh mengubah perannya sendiri jadi pengurus
create or replace function cegah_ubah_peran() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.peran is distinct from old.peran
     and auth.uid() is not null
     and not is_pengurus() then
    raise exception 'Hanya pengurus yang boleh mengubah peran';
  end if;
  return new;
end;
$$;

create trigger trg_cegah_ubah_peran
  before update on profiles
  for each row execute function cegah_ubah_peran();

-- 2.5 Tanggal terbit warta otomatis saat status jadi 'terbit'
create or replace function set_tanggal_terbit() returns trigger
language plpgsql as $$
begin
  if new.status = 'terbit' and new.tanggal_terbit is null then
    new.tanggal_terbit = current_date;
  end if;
  return new;
end;
$$;

create trigger trg_warta_terbit
  before insert or update on warta
  for each row execute function set_tanggal_terbit();


-- 2.6 Warga hanya boleh mengubah data kontak miliknya (no HP, alamat, data keluarga)
create or replace function kunci_data_jemaat() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not is_pengurus() then
    if new.status_baptis is distinct from old.status_baptis
       or new.status_sidi is distinct from old.status_sidi
       or new.wilayah     is distinct from old.wilayah
       or new.nama        is distinct from old.nama
       or new.id_profiles is distinct from old.id_profiles then
      raise exception 'Nama, wilayah, status baptis/sidi, dan tautan akun hanya dapat diubah oleh pengurus gereja';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_kunci_data_jemaat on jemaat;
create trigger trg_kunci_data_jemaat
  before update on jemaat
  for each row execute function kunci_data_jemaat();


-- ---------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (sesuai Tabel 3 Matriks Hak Akses)
-- ---------------------------------------------------------------------
alter table profiles           enable row level security;
alter table jemaat             enable row level security;
alter table permohonan_surat   enable row level security;
alter table transaksi_keuangan enable row level security;
alter table kegiatan           enable row level security;
alter table warta              enable row level security;

-- Akun Pengguna: warga U* (lihat & ubah milik sendiri), pengurus RU
create policy "profiles: lihat sendiri / pengurus semua" on profiles
  for select to authenticated using (id = auth.uid() or is_pengurus());
create policy "profiles: ubah sendiri / pengurus semua" on profiles
  for update to authenticated using (id = auth.uid() or is_pengurus())
  with check (id = auth.uid() or is_pengurus());

-- Data Jemaat: warga R* U*, pengurus CRUD
create policy "jemaat: warga lihat data sendiri" on jemaat
  for select to authenticated using (id_profiles = auth.uid());
create policy "jemaat: warga ubah data sendiri" on jemaat
  for update to authenticated using (id_profiles = auth.uid())
  with check (id_profiles = auth.uid());
create policy "jemaat: pengurus CRUD" on jemaat
  for all to authenticated using (is_pengurus()) with check (is_pengurus());

-- Layanan Surat: warga C* R*, pengurus RU
create policy "surat: warga lihat permohonan sendiri" on permohonan_surat
  for select to authenticated using (
    id_jemaat in (select id_jemaat from jemaat where id_profiles = auth.uid())
  );
create policy "surat: warga ajukan permohonan" on permohonan_surat
  for insert to authenticated with check (
    id_jemaat in (select id_jemaat from jemaat where id_profiles = auth.uid())
    and status = 'diajukan'
    and id_pengurus is null and nomor_surat is null and url_surat is null
  );
create policy "surat: pengurus lihat semua" on permohonan_surat
  for select to authenticated using (is_pengurus());
create policy "surat: pengurus proses" on permohonan_surat
  for update to authenticated using (is_pengurus()) with check (is_pengurus());

-- Keuangan: hanya pengurus (CRUD)
create policy "keuangan: pengurus CRUD" on transaksi_keuangan
  for all to authenticated using (is_pengurus()) with check (is_pengurus());

-- Jadwal Kegiatan: publik R, pengurus CRUD
create policy "kegiatan: semua boleh lihat" on kegiatan
  for select to anon, authenticated using (true);
create policy "kegiatan: pengurus CRUD" on kegiatan
  for all to authenticated using (is_pengurus()) with check (is_pengurus());

-- Warta: publik R (yang terbit), pengurus CRUD
create policy "warta: semua lihat yang terbit" on warta
  for select to anon, authenticated using (status = 'terbit');
create policy "warta: pengurus CRUD" on warta
  for all to authenticated using (is_pengurus()) with check (is_pengurus());


-- ---------------------------------------------------------------------
-- 4. VIEW LAPORAN & REKAP (saldo dan rekap bulanan otomatis)
--    security_invoker = RLS tetap berlaku -> hanya pengurus yang dapat data
-- ---------------------------------------------------------------------
create or replace view rekap_bulanan with (security_invoker = true) as
select
  date_trunc('month', tanggal)::date as bulan,
  sum(nominal) filter (where jenis_transaksi = 'pemasukan')   as total_pemasukan,
  sum(nominal) filter (where jenis_transaksi = 'pengeluaran') as total_pengeluaran,
  coalesce(sum(nominal) filter (where jenis_transaksi = 'pemasukan'), 0)
  - coalesce(sum(nominal) filter (where jenis_transaksi = 'pengeluaran'), 0) as selisih
from transaksi_keuangan
group by 1
order by 1 desc;

create or replace view saldo_kas with (security_invoker = true) as
select
  coalesce(sum(case when jenis_transaksi = 'pemasukan' then nominal else -nominal end), 0) as saldo
from transaksi_keuangan;


-- ---------------------------------------------------------------------
-- 5. SUPABASE STORAGE (berkas: lampiran, surat final, bukti transaksi)
--    Aturan path: <bucket>/<id_user_warga>/<nama_file>
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('lampiran', 'lampiran', false),
  ('surat', 'surat', false),
  ('bukti-transaksi', 'bukti-transaksi', false),
  ('publik', 'publik', true)   -- poster kegiatan & PDF warta (boleh dibaca umum)
on conflict (id) do nothing;

-- Lampiran permohonan: warga upload & lihat di foldernya sendiri, pengurus lihat semua
create policy "lampiran: warga upload ke folder sendiri" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'lampiran' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "lampiran: lihat milik sendiri / pengurus" on storage.objects
  for select to authenticated using (
    bucket_id = 'lampiran'
    and ((storage.foldername(name))[1] = auth.uid()::text or is_pengurus())
  );

-- Surat final: pengurus upload/ubah/hapus, warga hanya unduh suratnya sendiri
create policy "surat: pengurus kelola" on storage.objects
  for all to authenticated using (bucket_id = 'surat' and is_pengurus())
  with check (bucket_id = 'surat' and is_pengurus());
create policy "surat: warga unduh milik sendiri" on storage.objects
  for select to authenticated using (
    bucket_id = 'surat' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Bukti transaksi: hanya pengurus
create policy "bukti: pengurus kelola" on storage.objects
  for all to authenticated using (bucket_id = 'bukti-transaksi' and is_pengurus())
  with check (bucket_id = 'bukti-transaksi' and is_pengurus());


-- Poster kegiatan & PDF warta: semua boleh lihat (bucket publik), pengurus yang upload
create policy "publik: pengurus kelola" on storage.objects
  for all to authenticated using (bucket_id = 'publik' and is_pengurus())
  with check (bucket_id = 'publik' and is_pengurus());


-- ---------------------------------------------------------------------
-- 6. FUNGSI HAPUS AKUN (dipakai menu Akun Pengguna)
--    Menghapus akun login (auth.users); profiles ikut terhapus (cascade),
--    tautan di jemaat/transaksi/kegiatan/warta otomatis menjadi null.
-- ---------------------------------------------------------------------
create or replace function hapus_akun(target uuid) returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if not is_pengurus() then
    raise exception 'Hanya pengurus yang boleh menghapus akun';
  end if;
  if target = auth.uid() then
    raise exception 'Tidak dapat menghapus akun sendiri';
  end if;
  delete from auth.users where id = target;
end;
$$;

revoke execute on function hapus_akun(uuid) from public, anon;
grant execute on function hapus_akun(uuid) to authenticated;


-- ---------------------------------------------------------------------
-- 6b. IZIN DATA API (GRANT)
--    Project Supabase baru tidak otomatis memberi izin tabel ke aplikasi.
--    Tanpa ini login gagal walau peran sudah 'pengurus'. RLS tetap berlaku.
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant select on kegiatan, warta to anon;
grant execute on all functions in schema public to authenticated, service_role;


-- ---------------------------------------------------------------------
-- 7. PENGURUS PERTAMA
--    Daftar akun dulu (halaman /register atau Authentication > Users),
--    lalu jalankan baris ini dengan email akun tersebut:
--
-- update profiles set peran = 'pengurus' where email = 'email-anda@contoh.com';
-- ---------------------------------------------------------------------
