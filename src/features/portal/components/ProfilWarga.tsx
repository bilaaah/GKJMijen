'use client';

import React, { useState } from 'react';
import { Button, YesNoBadge } from '@/components/common';
import { FormInput, FormTextarea } from '@/components/forms';
import { Alert, useToast } from '@/components/feedback';
import { useData } from '@/lib/data';
import { usePortalData } from '../usePortalData';

/**
 * Profil Saya (UC05 – Kelola Data Profil Sendiri).
 * Warga boleh mengubah nama akun serta data kontak di data jemaatnya (no HP, alamat, data keluarga).
 * Nama resmi, wilayah, status baptis & sidi adalah data gereja: hanya ditampilkan, diubah oleh
 * sekretariat (dijaga juga oleh trigger kunci_data_jemaat di database).
 */
export const ProfilWarga: React.FC = () => {
  const { updateUser } = useData();
  const { user, jemaat, setDb } = usePortalData();
  const toast = useToast();
  const [nama, setNama] = useState(user?.nama ?? '');
  const [noHp, setNoHp] = useState(jemaat?.no_hp ?? '');
  const [alamat, setAlamat] = useState(jemaat?.alamat ?? '');
  const [keluarga, setKeluarga] = useState(jemaat?.data_keluarga ?? '');
  const [errors, setErrors] = useState<{ nama?: string; noHp?: string }>({});

  if (!user) return null;

  const simpanAkun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return setErrors({ nama: 'Nama tidak boleh kosong.' });
    setErrors({});
    updateUser({ nama: nama.trim() });
    toast('Nama akun diperbarui.');
  };

  const simpanKontak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jemaat) return;
    if (noHp.trim() && !/^[0-9+\-\s()]{8,20}$/.test(noHp.trim())) return setErrors({ noHp: 'Nomor HP hanya berisi angka, contoh 081234567890.' });
    setErrors({});
    setDb((d) => ({
      ...d,
      jemaat: d.jemaat.map((x) => (x.id === jemaat.id ? { ...x, no_hp: noHp.trim(), alamat: alamat.trim(), data_keluarga: keluarga.trim() } : x)),
    }));
    toast('Data kontak diperbarui.');
  };

  return (
    <div className="pt-page">
      <div className="pt-head">
        <h1>Profil Saya</h1>
        <p className="muted">Perbarui data akun dan kontak Anda. Data resmi gereja diubah oleh sekretariat.</p>
      </div>

      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'start' }}>
        <form className="gk-card form-stack" onSubmit={simpanAkun} noValidate>
          <h3>Akun</h3>
          <FormInput id="nama-akun" label="Nama" value={nama} onChange={(e) => setNama(e.target.value)} error={errors.nama} />
          <FormInput id="email-akun" label="Email" value={user.email} disabled helperText="Email dipakai untuk masuk dan tidak dapat diubah di sini." />
          <div>
            <Button type="submit" icon="check-lg">
              Simpan Nama
            </Button>
          </div>
        </form>

        {jemaat ? (
          <form className="gk-card form-stack" onSubmit={simpanKontak} noValidate>
            <h3>Data Jemaat</h3>
            <dl className="dl">
              <div>
                <dt>Nama resmi</dt>
                <dd>{jemaat.nama}</dd>
              </div>
              <div>
                <dt>Wilayah</dt>
                <dd>{jemaat.wilayah || '–'}</dd>
              </div>
              <div>
                <dt>Status baptis</dt>
                <dd>
                  <YesNoBadge value={jemaat.status_baptis} />
                </dd>
              </div>
              <div>
                <dt>Status sidi</dt>
                <dd>
                  <YesNoBadge value={jemaat.status_sidi} />
                </dd>
              </div>
            </dl>
            <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
              Ada data di atas yang keliru? Hubungi sekretariat gereja agar diperbaiki.
            </p>
            <FormInput id="no-hp" label="No. HP / WhatsApp" inputMode="tel" value={noHp} onChange={(e) => setNoHp(e.target.value)} error={errors.noHp} />
            <FormTextarea id="alamat" label="Alamat" rows={2} value={alamat} onChange={(e) => setAlamat(e.target.value)} />
            <FormTextarea
              id="keluarga"
              label="Data keluarga"
              rows={3}
              placeholder="Contoh: Istri: Maria; Anak: Samuel (2020)"
              value={keluarga}
              onChange={(e) => setKeluarga(e.target.value)}
            />
            <div>
              <Button type="submit" icon="check-lg">
                Simpan Data Kontak
              </Button>
            </div>
          </form>
        ) : (
          <div className="gk-card">
            <h3>Data Jemaat</h3>
            <Alert tone="warn" style={{ marginTop: 12 }}>
              Akun Anda belum tertaut ke data jemaat. Hubungi sekretariat gereja (Senin 09.00–15.00) agar akun ditautkan.
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};
