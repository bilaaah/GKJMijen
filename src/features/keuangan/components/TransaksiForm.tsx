'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, PageHeader } from '@/components/common';
import { Field, FileDrop, FormInput, FormSelect, FormTextarea, RupiahInput, Segmented } from '@/components/forms';
import { EmptyState, useToast } from '@/components/feedback';
import { newId, unggahBerkas, useData, KATEGORI_TRANSAKSI, type JenisTransaksi } from '@/lib/data';
import { hariIniISO, namaBerkas } from '@/utils/formatters';
import { ROUTES } from '@/lib/constants/routes';

type Errors = Partial<Record<'tanggal' | 'kategori' | 'nominal' | 'keterangan' | 'bukti', string>>;

/** Form catat/ubah transaksi keuangan beserta foto bukti. */
export const TransaksiForm: React.FC<{ id?: string }> = ({ id }) => {
  const { db, setDb, user } = useData();
  const router = useRouter();
  const toast = useToast();
  const existing = id ? db.transaksi.find((t) => t.id === id) : undefined;
  const [jenis, setJenis] = useState<JenisTransaksi>(existing?.jenis_transaksi ?? 'pemasukan');
  const [tanggal, setTanggal] = useState(existing?.tanggal ?? hariIniISO());
  const [kategori, setKategori] = useState(existing?.kategori ?? '');
  const [nominal, setNominal] = useState(existing?.nominal ?? 0);
  const [keterangan, setKeterangan] = useState(existing?.keterangan ?? '');
  const [bukti, setBukti] = useState(existing?.bukti_url ?? '');
  const [buktiNama, setBuktiNama] = useState(existing ? namaBerkas(existing.bukti_url.startsWith('data:') ? 'foto-bukti.jpg' : existing.bukti_url) : '');
  const [errors, setErrors] = useState<Errors>({});

  if (id && !existing) return <EmptyState title="Transaksi tidak ditemukan" description="Transaksi mungkin sudah dihapus." />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!tanggal) er.tanggal = 'Pilih tanggal transaksi.';
    if (!kategori) er.kategori = 'Pilih kategori.';
    if (!nominal) er.nominal = 'Isi nominal lebih dari Rp 0.';
    if (!keterangan.trim()) er.keterangan = 'Tulis keterangan singkat transaksi.';
    setErrors(er);
    if (Object.keys(er).length) return;
    const data = { tanggal, jenis_transaksi: jenis, kategori, nominal, keterangan: keterangan.trim(), bukti_url: bukti };
    setDb((d) => ({
      ...d,
      transaksi: existing ? d.transaksi.map((t) => (t.id === existing.id ? { ...t, ...data } : t)) : [...d.transaksi, { id: newId('t'), id_profiles: user?.id ?? '', ...data }],
    }));
    toast('Transaksi tersimpan. Saldo diperbarui otomatis.');
    router.push(ROUTES.DASHBOARD.KEUANGAN);
  };

  return (
    <>
      <PageHeader
        eyebrow="Keuangan"
        title={existing ? 'Ubah Transaksi' : 'Catat Transaksi'}
        description={existing ? 'Perbaiki data transaksi yang salah input. Saldo akan dihitung ulang otomatis.' : 'Masukkan pemasukan atau pengeluaran lengkap dengan bukti.'}
        actions={
          <Button variant="outline" icon="arrow-left" onClick={() => router.back()}>
            Kembali
          </Button>
        }
      />
      <Card style={{ maxWidth: 760 }}>
        <form onSubmit={submit} noValidate>
          <Field label="Jenis Transaksi">
            <div>
              <Segmented<JenisTransaksi>
                label="Jenis transaksi"
                value={jenis}
                onChange={setJenis}
                options={[
                  { value: 'pemasukan', label: 'Pemasukan', icon: 'arrow-down-left', tone: 'ok' },
                  { value: 'pengeluaran', label: 'Pengeluaran', icon: 'arrow-up-right', tone: 'bad' },
                ]}
              />
            </div>
          </Field>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <FormInput id="tanggal" label="Tanggal" required type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} error={errors.tanggal} />
            <FormSelect
              id="kategori"
              label="Kategori"
              required
              placeholder="Pilih kategori"
              options={KATEGORI_TRANSAKSI.map((k) => ({ value: k, label: k }))}
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              error={errors.kategori}
            />
            <RupiahInput id="nominal" label="Nominal" required fieldClassName="full" value={nominal} onChange={setNominal} error={errors.nominal} />
            <FormTextarea
              id="keterangan"
              label="Keterangan"
              required
              fieldClassName="full"
              rows={2}
              placeholder="contoh: Persembahan Ibadah Minggu, 22 November"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              error={errors.keterangan}
            />
          </div>
          <Field label="Foto Bukti" error={errors.bukti} className="mt-3">
            {bukti && (
              <div className="file-row" style={{ marginBottom: 8 }}>
                {bukti.startsWith('data:') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bukti} alt="Pratinjau bukti" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                  <span className="fi">
                    <i className="bi bi-image" aria-hidden="true" />
                  </span>
                )}
                <div className="ft">
                  <b>{buktiNama}</b>
                  <small>Foto bukti transaksi</small>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  icon="trash3"
                  onClick={() => {
                    setBukti('');
                    setBuktiNama('');
                  }}
                >
                  Hapus
                </Button>
              </div>
            )}
            <FileDrop
              id="bukti-file"
              accept="image/png,image/jpeg"
              allowedTypes={['image/png', 'image/jpeg']}
              maxMB={5}
              icon="camera"
              title={bukti ? 'Ganti foto bukti' : 'Unggah foto nota atau amplop persembahan'}
              hint="JPG atau PNG · maks. 5 MB"
              typeError="Bukti harus berupa foto (JPG atau PNG)."
              onFile={async (f) => {
                setBuktiNama(`Mengunggah ${f.name}…`);
                const res = await unggahBerkas(f, 'bukti');
                if (!res.ok) {
                  setBuktiNama('');
                  return setErrors((e) => ({ ...e, bukti: res.message }));
                }
                setBukti(res.url);
                setBuktiNama(f.name);
              }}
              onError={(m) => setErrors((e) => ({ ...e, bukti: m || undefined }))}
            />
          </Field>
          <div className="modal-acts">
            <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.KEUANGAN)}>
              Batal
            </Button>
            <Button type="submit" icon="check-lg">
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};
