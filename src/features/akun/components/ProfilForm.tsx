'use client';

import React, { useState } from 'react';
import { Button, Card, PageHeader } from '@/components/common';
import { FormInput, PasswordInput } from '@/components/forms';
import { useToast } from '@/components/feedback';
import { useData } from '@/lib/data';
import { ROLE_LABELS } from '@/lib/auth/roles';
import { formatTanggalPendek, inisial } from '@/utils/formatters';

/** Profil pengguna yang sedang login: ubah nama dan kata sandi. */
export const ProfilForm: React.FC = () => {
  const { db, user, updateUser } = useData();
  const toast = useToast();
  const [nama, setNama] = useState(user?.nama ?? '');
  const [namaErr, setNamaErr] = useState('');
  const [pw, setPw] = useState({ lama: '', baru: '', konf: '' });
  const [pwErr, setPwErr] = useState<{ lama?: string; baru?: string; konf?: string }>({});

  if (!user) return null;
  const jemaat = db.jemaat.find((j) => j.id_profiles === user.id);

  return (
    <>
      <PageHeader eyebrow="Pengaturan" title="Profil Saya" description="Perbarui nama dan kata sandi akun Anda." />
      <div className="grid-profil">
        <Card title="Informasi Akun">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!nama.trim()) return setNamaErr('Nama wajib diisi.');
              setNamaErr('');
              updateUser({ nama: nama.trim() });
              toast('Profil diperbarui.');
            }}
            noValidate
          >
            <div className="person" style={{ marginBottom: 18 }}>
              <span className="avatar lg">{inisial(user.nama)}</span>
              <div>
                <b style={{ fontSize: 17 }}>{user.nama}</b>
                <small>Terdaftar sejak {formatTanggalPendek(user.created_at)}</small>
              </div>
            </div>
            <div className="form-stack">
              <FormInput id="nama" label="Nama" required value={nama} onChange={(e) => setNama(e.target.value)} error={namaErr} />
              <FormInput id="email-ro" label="Email" value={user.email} readOnly helperText="Email tidak dapat diubah dari halaman ini." />
              <FormInput id="peran-ro" label="Peran" value={ROLE_LABELS[user.peran]} readOnly />
              <FormInput id="jemaat-ro" label="Jemaat Tertaut" value={jemaat ? jemaat.nama : 'Belum tertaut'} readOnly />
              <div>
                <Button type="submit" icon="check-lg">
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </form>
        </Card>
        <Card title="Ubah Kata Sandi">
          <form
            className="form-stack"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const er: typeof pwErr = {};
              if (!pw.lama) er.lama = 'Masukkan kata sandi saat ini.';
              if (pw.baru.length < 8) er.baru = 'Kata sandi baru minimal 8 karakter.';
              else if (pw.baru === pw.lama) er.baru = 'Kata sandi baru harus berbeda dari yang lama.';
              if (pw.konf !== pw.baru) er.konf = 'Konfirmasi kata sandi tidak cocok.';
              setPwErr(er);
              if (Object.keys(er).length) return;
              setPw({ lama: '', baru: '', konf: '' });
              toast('Kata sandi berhasil diperbarui.');
            }}
          >
            <PasswordInput id="lama" label="Kata Sandi Lama" required placeholder="Kata sandi saat ini" autoComplete="current-password" value={pw.lama} onChange={(e) => setPw({ ...pw, lama: e.target.value })} error={pwErr.lama} />
            <PasswordInput id="baru" label="Kata Sandi Baru" required placeholder="Minimal 8 karakter" autoComplete="new-password" value={pw.baru} onChange={(e) => setPw({ ...pw, baru: e.target.value })} error={pwErr.baru} />
            <PasswordInput id="konf" label="Konfirmasi Kata Sandi Baru" required placeholder="Ulangi kata sandi baru" autoComplete="new-password" value={pw.konf} onChange={(e) => setPw({ ...pw, konf: e.target.value })} error={pwErr.konf} />
            <div>
              <Button type="submit" icon="key">
                Perbarui Kata Sandi
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};
