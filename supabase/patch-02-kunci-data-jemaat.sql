-- =====================================================================
-- PATCH 02: warga hanya boleh mengubah data kontak miliknya sendiri.
-- Status baptis, status sidi, wilayah, nama, dan tautan akun hanya boleh
-- diubah pengurus (data resmi gereja). Aman dijalankan berulang kali.
-- =====================================================================
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
