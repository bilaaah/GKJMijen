'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, PageHeader } from '@/components/common';
import { FormInput, FormSelect, FormTextarea, Switch } from '@/components/forms';
import { EmptyState, useToast } from '@/components/feedback';
import { newId, useMock, WILAYAH, type Jemaat } from '@/lib/mock';
import { ROUTES, routeJemaatDetail } from '@/lib/constants/routes';

type Errors = Partial<Record<'nama' | 'no_hp' | 'wilayah' | 'alamat', string>>;

const KOSONG: Omit<Jemaat, 'id'> = { nama: '', no_hp: '', alamat: '', wilayah: '', data_keluarga: '', status_baptis: false, status_sidi: false, id_profiles: null };

/** Form tambah/ubah data jemaat. */
export const JemaatForm: React.FC<{ id?: string }> = ({ id }) => {
  const { db, setDb } = useMock();
  const router = useRouter();
  const toast = useToast();
  const existing = id ? db.jemaat.find((j) => j.id === id) : undefined;
  const [f, setF] = useState<Omit<Jemaat, 'id'>>(existing ? { ...existing } : KOSONG);
  const [errors, setErrors] = useState<Errors>({});

  if (id && !existing) return <EmptyState title="Data jemaat tidak ditemukan" description="Data mungkin sudah dihapus." />;

  const akunOpts = db.profiles.filter((p) => p.peran === 'warga' && (!db.jemaat.some((j) => j.id_profiles === p.id) || p.id === existing?.id_profiles));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!f.nama.trim()) er.nama = 'Nama lengkap wajib diisi.';
    if (f.no_hp && !/^[0-9+\-\s]{8,}$/.test(f.no_hp)) er.no_hp = 'Gunakan angka, contoh: 0812-2534-7781.';
    if (!f.wilayah) er.wilayah = 'Pilih wilayah jemaat.';
    if (!f.alamat.trim()) er.alamat = 'Alamat wajib diisi.';
    setErrors(er);
    if (Object.keys(er).length) return;
    const data = { ...f, nama: f.nama.trim(), alamat: f.alamat.trim(), data_keluarga: f.data_keluarga.trim(), no_hp: f.no_hp.trim() };
    const newIdValue = existing?.id ?? newId('j');
    setDb((d) => ({ ...d, jemaat: existing ? d.jemaat.map((j) => (j.id === existing.id ? { ...j, ...data } : j)) : [...d.jemaat, { id: newIdValue, ...data }] }));
    toast(`Data ${data.nama} berhasil disimpan.`);
    router.push(routeJemaatDetail(newIdValue));
  };

  return (
    <>
      <PageHeader
        eyebrow="Pelayanan"
        title={existing ? 'Ubah Data Jemaat' : 'Tambah Jemaat'}
        description={existing ? `Perbarui data ${existing.nama}.` : 'Lengkapi data pribadi dan status gerejawi jemaat.'}
        actions={
          <Button variant="outline" icon="arrow-left" onClick={() => router.back()}>
            Kembali
          </Button>
        }
      />
      <Card style={{ maxWidth: 880 }}>
        <form onSubmit={submit} noValidate>
          <div className="sec-label first">Data pribadi</div>
          <div className="form-grid">
            <FormInput id="nama" label="Nama Lengkap" required fieldClassName="full" placeholder="contoh: Bambang Sutrisno" value={f.nama} onChange={(e) => set('nama', e.target.value)} error={errors.nama} />
            <FormInput id="no_hp" label="No. HP" inputMode="tel" placeholder="0812-xxxx-xxxx" helperText="Kosongkan untuk anak yang belum memiliki nomor." value={f.no_hp} onChange={(e) => set('no_hp', e.target.value)} error={errors.no_hp} />
            <FormSelect id="wilayah" label="Wilayah" required placeholder="Pilih wilayah" options={WILAYAH.map((w) => ({ value: w, label: w }))} value={f.wilayah} onChange={(e) => set('wilayah', e.target.value)} error={errors.wilayah} />
            <FormTextarea id="alamat" label="Alamat" required fieldClassName="full" rows={2} placeholder="Nama jalan, RT/RW, kelurahan" value={f.alamat} onChange={(e) => set('alamat', e.target.value)} error={errors.alamat} />
          </div>
          <div className="sec-label">Keluarga</div>
          <FormTextarea
            id="data_keluarga"
            label="Data Keluarga"
            rows={4}
            placeholder={'Istri: Endang Sutrisno\nAnak: Yosua Adi Nugroho'}
            helperText="Tulis satu anggota keluarga per baris dengan format Hubungan: Nama."
            value={f.data_keluarga}
            onChange={(e) => set('data_keluarga', e.target.value)}
          />
          <div className="sec-label">Status gerejawi</div>
          <div className="form-grid">
            <Switch id="status_baptis" label="Sudah dibaptis" description="Baptis anak atau baptis dewasa" checked={f.status_baptis} onChange={(v) => set('status_baptis', v)} />
            <Switch id="status_sidi" label="Sudah sidi" description="Pengakuan percaya / sidi" checked={f.status_sidi} onChange={(v) => set('status_sidi', v)} />
          </div>
          <div className="sec-label">Akun pengguna</div>
          <FormSelect
            id="id_profiles"
            label="Tautkan ke Akun"
            placeholder="— Tidak ditautkan —"
            helperText="Hanya akun warga yang belum tertaut. Satu akun mewakili satu jemaat."
            options={akunOpts.map((p) => ({ value: p.id, label: `${p.nama} · ${p.email}` }))}
            value={f.id_profiles ?? ''}
            onChange={(e) => set('id_profiles', e.target.value || null)}
          />
          <div className="modal-acts">
            <Button variant="outline" onClick={() => router.push(existing ? routeJemaatDetail(existing.id) : ROUTES.DASHBOARD.JEMAAT)}>
              Batal
            </Button>
            <Button type="submit" icon="check-lg">
              Simpan
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};
