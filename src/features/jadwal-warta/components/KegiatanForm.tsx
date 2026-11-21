'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, PageHeader } from '@/components/common';
import { Field, FileDrop, FormInput } from '@/components/forms';
import { EmptyState, useConfirm, useToast } from '@/components/feedback';
import { newId, unggahBerkas, useData } from '@/lib/data';
import { formatTanggalPendek } from '@/utils/formatters';
import { ROUTES } from '@/lib/constants/routes';
import { PetugasEditor } from './PetugasEditor';

type Errors = Partial<Record<'nama_kegiatan' | 'tanggal' | 'jam' | 'lokasi' | 'poster', string>>;

/** Form tambah/ubah kegiatan, termasuk unggah poster/pamflet PNG atau JPG. */
export const KegiatanForm: React.FC<{ id?: string }> = ({ id }) => {
  const { db, setDb, user } = useData();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const existing = id ? db.kegiatan.find((k) => k.id === id) : undefined;
  const [f, setF] = useState({
    nama_kegiatan: existing?.nama_kegiatan ?? '',
    tanggal: existing?.tanggal ?? '',
    jam: existing?.jam ?? '',
    lokasi: existing?.lokasi ?? '',
    petugas: existing?.petugas ?? '',
  });
  const [poster, setPoster] = useState(existing?.url_poster ?? '');
  const [posterNama, setPosterNama] = useState(existing?.url_poster ? `poster-${existing.id}.jpg` : '');
  const [errors, setErrors] = useState<Errors>({});

  const unggahPoster = async (file: File) => {
    setPosterNama(`Mengunggah ${file.name}…`);
    const res = await unggahBerkas(file, 'poster');
    if (!res.ok) {
      setPosterNama(poster ? posterNama : '');
      return setErrors((e) => ({ ...e, poster: res.message }));
    }
    setPoster(res.url);
    setPosterNama(file.name);
  };
  const lokasiList = useMemo(() => Array.from(new Set(db.kegiatan.map((k) => k.lokasi))), [db.kegiatan]);
  const saranNama = useMemo(() => Array.from(new Set(db.jemaat.map((j) => j.nama))).sort((a, b) => a.localeCompare(b)), [db.jemaat]);

  if (id && !existing) return <EmptyState title="Kegiatan tidak ditemukan" description="Kegiatan mungkin sudah dihapus." />;

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!f.nama_kegiatan.trim()) er.nama_kegiatan = 'Nama kegiatan wajib diisi.';
    if (!f.tanggal) er.tanggal = 'Pilih tanggal.';
    if (!f.jam) er.jam = 'Isi jam mulai.';
    if (!f.lokasi.trim()) er.lokasi = 'Lokasi wajib diisi.';
    setErrors(er);
    if (Object.keys(er).length) return;
    const data = { ...f, nama_kegiatan: f.nama_kegiatan.trim(), lokasi: f.lokasi.trim(), petugas: f.petugas.trim(), url_poster: poster };
    setDb((d) => ({
      ...d,
      kegiatan: existing ? d.kegiatan.map((k) => (k.id === existing.id ? { ...k, ...data } : k)) : [...d.kegiatan, { id: newId('k'), id_profiles: user?.id ?? '', ...data }],
    }));
    toast('Kegiatan tersimpan dan tampil di landing page.');
    router.push(ROUTES.DASHBOARD.JADWAL_WARTA);
  };

  return (
    <>
      <PageHeader
        eyebrow="Jadwal & Warta"
        title={existing ? 'Ubah Kegiatan' : 'Tambah Kegiatan'}
        description="Kegiatan yang disimpan langsung tampil di landing page publik."
        actions={
          <Button variant="outline" icon="arrow-left" onClick={() => router.back()}>
            Kembali
          </Button>
        }
      />
      <Card style={{ maxWidth: 820 }}>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <FormInput id="nama_kegiatan" label="Nama Kegiatan" required fieldClassName="full" placeholder="contoh: Ibadah Minggu Umum" value={f.nama_kegiatan} onChange={(e) => set('nama_kegiatan', e.target.value)} error={errors.nama_kegiatan} />
            <FormInput id="tanggal" label="Tanggal" required type="date" value={f.tanggal} onChange={(e) => set('tanggal', e.target.value)} error={errors.tanggal} />
            <FormInput id="jam" label="Jam" required type="time" value={f.jam} onChange={(e) => set('jam', e.target.value)} error={errors.jam} />
            <FormInput
              id="lokasi"
              label="Lokasi"
              required
              fieldClassName="full"
              list="lokasi-list"
              placeholder="contoh: Gedung Gereja GKJ Mijen"
              value={f.lokasi}
              onChange={(e) => set('lokasi', e.target.value)}
              error={errors.lokasi}
            />
            <datalist id="lokasi-list">
              {lokasiList.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
            <Field label="Petugas" className="full" helperText="Kolom yang dibiarkan kosong tidak ikut disimpan.">
              <PetugasEditor value={f.petugas} onChange={(v) => set('petugas', v)} saranNama={saranNama} />
            </Field>
            <Field
              label={
                <>
                  Poster / Pamflet <span className="muted" style={{ fontWeight: 400 }}>(opsional)</span>
                </>
              }
              error={errors.poster}
              className="full"
            >
              {poster ? (
                <div className="poster-prev">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={poster} alt="Pratinjau poster kegiatan" />
                  <div className="pp-tx">
                    <b>{posterNama || 'Poster kegiatan'}</b>
                    <span className="hint">Poster tampil di landing page bersama informasi kegiatan.</span>
                    <div className="acts-inline">
                      <label htmlFor="k-poster-ganti" className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-arrow-repeat" aria-hidden="true" /> Ganti
                      </label>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="trash3"
                        style={{ color: 'var(--bad)' }}
                        onClick={() => {
                          setPoster('');
                          setPosterNama('');
                        }}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                  <div hidden>
                    <FileDrop
                      id="k-poster-ganti"
                      accept="image/png,image/jpeg"
                      allowedTypes={['image/png', 'image/jpeg']}
                      maxMB={5}
                      icon="image"
                      title=""
                      hint=""
                      typeError="Poster harus berformat PNG atau JPG."
                      onFile={(file) => unggahPoster(file)}
                      onError={(m) => setErrors((e) => ({ ...e, poster: m || undefined }))}
                    />
                  </div>
                </div>
              ) : (
                <FileDrop
                  id="k-poster-file"
                  accept="image/png,image/jpeg"
                  allowedTypes={['image/png', 'image/jpeg']}
                  maxMB={5}
                  icon="file-earmark-image"
                  title="Unggah poster atau pamflet"
                  hint="PNG atau JPG · maks. 5 MB · seret ke sini atau klik untuk memilih"
                  typeError="Poster harus berformat PNG atau JPG."
                  onFile={(file) => unggahPoster(file)}
                  onError={(m) => setErrors((e) => ({ ...e, poster: m || undefined }))}
                />
              )}
            </Field>
          </div>
          <div className="modal-acts">
            {existing && (
              <Button
                variant="ghost"
                icon="trash3"
                style={{ marginRight: 'auto', color: 'var(--bad)' }}
                onClick={() =>
                  confirm({
                    title: 'Hapus kegiatan?',
                    message: (
                      <>
                        <b style={{ color: 'var(--espresso)' }}>
                          {existing.nama_kegiatan} ({formatTanggalPendek(existing.tanggal)})
                        </b>{' '}
                        akan dihapus permanen.
                      </>
                    ),
                    onConfirm: () => {
                      setDb((d) => ({ ...d, kegiatan: d.kegiatan.filter((k) => k.id !== existing.id) }));
                      toast('Kegiatan berhasil dihapus.');
                      router.push(ROUTES.DASHBOARD.JADWAL_WARTA);
                    },
                  })
                }
              >
                Hapus
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.JADWAL_WARTA)}>
              Batal
            </Button>
            <Button type="submit" icon="check-lg">
              Simpan Kegiatan
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};
