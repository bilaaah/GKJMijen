'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Icon, IconButton, Modal } from '@/components/common';
import { Alert, useToast } from '@/components/feedback';
import { Field, FileDrop } from '@/components/forms';
import { newId, unggahBerkas } from '@/lib/data';
import { ROUTES, routePortalSurat } from '@/lib/constants/routes';
import { hariIniISO, namaBerkas } from '@/utils/formatters';
import { sanitizeFileName } from '@/utils/storage';
import { usePortalData } from '../usePortalData';
import { LAYANAN, tampilIsi, alasanTidakBisa, bacaKeterangan, layananById, namaLayanan, susunKeterangan, type Layanan, type LayananId } from '../layanan';

const TIPE_LAMPIRAN = ['application/pdf', 'image/jpeg', 'image/png'];
const MAKS_MB = 5;

const ukuran = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/**
 * Formulir pengajuan surat (UC03).
 * Langkah: 1) pilih layanan → 2) isi data + lampiran → 3) periksa lalu kirim.
 * ?layanan=<id> memilih layanan otomatis, ?ulang=<id surat> mengisi ulang dari permohonan yang ditolak.
 *
 * TODO [Backend]: ganti setDb(...) di kirim() dengan Server Action ajukanSurat()
 * yang mengunggah lampiran ke Supabase Storage lalu insert ke permohonan_surat.
 */
export const AjukanSurat: React.FC = () => {
  const { user, jemaat, surat, setDb } = usePortalData();
  const params = useSearchParams();
  const toast = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  const ulang = useMemo(() => surat.find((s) => s.id === params.get('ulang') && s.status === 'ditolak') ?? null, [surat, params]);

  const [pilihan, setPilihan] = useState<LayananId | null>(() => (layananById(params.get('layanan'))?.id ?? null) as LayananId | null);
  const [isian, setIsian] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState('');
  const [setuju, setSetuju] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [periksa, setPeriksa] = useState(false);
  const [mengirim, setMengirim] = useState(false);
  const [terkirim, setTerkirim] = useState<string | null>(null);

  // Isi ulang dari permohonan yang ditolak
  useEffect(() => {
    if (!ulang) return;
    const lama: Record<string, string> = {};
    bacaKeterangan(ulang).forEach(({ label, isi }) => {
      if (isi !== '-') lama[label] = isi;
    });
    setIsian(lama);
  }, [ulang]);

  const layanan = layananById(pilihan) ?? null;
  const dirty = !terkirim && (Object.values(isian).some((v) => v.trim()) || !!file);

  // Peringatan bila menutup tab saat formulir sudah diisi
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const wajibTerisi = (l: Layanan) => l.fields.filter((f) => f.required).every((f) => (isian[f.key] ?? '').trim()) && (!l.lampiranWajib || !!file);
  const langkah = !layanan ? 1 : !wajibTerisi(layanan) || !setuju ? 2 : 3;

  const pilih = (l: Layanan) => {
    if (alasanTidakBisa(l, jemaat)) return;
    setPilihan(l.id);
    setErrors({});
    if (window.innerWidth < 900) setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const validasi = () => {
    if (!layanan) return false;
    const er: Record<string, string> = {};
    layanan.fields.forEach((f) => {
      const v = (isian[f.key] ?? '').trim();
      if (f.required && !v) er[f.key] = `${f.label} wajib diisi.`;
      if (f.type === 'date' && v && v > hariIniISO()) er[f.key] = 'Tanggal tidak boleh melewati hari ini.';
    });
    if (layanan.lampiranWajib && !file) er.lampiran = `Unggah ${layanan.lampiran.toLowerCase()}.`;
    if (!setuju) er.setuju = 'Centang pernyataan ini sebelum melanjutkan.';
    setErrors(er);
    if (Object.keys(er).length) {
      const first = document.querySelector<HTMLElement>('.pt-form .invalid, .pt-form .err:not(:empty)');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const kirim = async () => {
    if (!layanan || !jemaat || !user) return;
    setMengirim(true);
    let lampiranUrl = '';
    if (file) {
      const up = await unggahBerkas(file, 'lampiran', user.id);
      if (!up.ok) {
        setMengirim(false);
        toast(up.message, 'bad');
        return;
      }
      lampiranUrl = up.url;
    }
    const id = newId('s');
    setDb((db) => ({
      ...db,
      surat: [
        {
          id,
          id_jemaat: jemaat.id,
          id_pengurus: null,
          jenis_surat: layanan.jenis,
          tanggal_pengajuan: hariIniISO(),
          status: 'diajukan',
          catatan: '',
          nomor_surat: '',
          url_lampiran: lampiranUrl,
          url_surat: '',
          keterangan: susunKeterangan(layanan, isian),
        },
        ...db.surat,
      ],
    }));
    setMengirim(false);
    setPeriksa(false);
    setTerkirim(id);
    toast('Permohonan terkirim. Pengurus akan segera memeriksanya.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) return null;

  /* ---------- Tampilan setelah berhasil ---------- */
  if (terkirim && layanan) {
    return (
      <div className="pt-page">
        <div className="pt-success">
          <svg className="pt-check" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="29" />
            <path d="M20 33 l8 8 l16 -18" />
          </svg>
          <h1>Permohonan terkirim</h1>
          <p className="muted">
            Permohonan <b>{layanan.nama}</b> sudah kami terima dengan status <b>Menunggu diperiksa</b>. Anda akan melihat perkembangannya di halaman Status.
          </p>
          <ol className="pt-next">
            <li>Pengurus memeriksa data dan lampiran Anda.</li>
            <li>Bila lengkap, surat diproses dan diberi nomor.</li>
            <li>Setelah selesai, surat bisa diunduh dari portal ini.</li>
          </ol>
          <div className="pt-success-acts">
            <Link href={routePortalSurat(terkirim)} className="btn btn-primary">
              <Icon name="clipboard-check" /> Lihat status permohonan
            </Link>
            <Link href={ROUTES.PORTAL.ROOT} className="btn btn-outline-primary">
              Kembali ke dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Formulir ---------- */
  return (
    <div className="pt-page">
      <div className="pt-head">
        <h1>Ajukan Surat</h1>
        <p className="muted">Pilih layanan, lengkapi data, lalu kirim. Status permohonan bisa dipantau kapan saja.</p>
      </div>

      <ol className="pt-progress" aria-label="Langkah pengajuan">
        {['Pilih layanan', 'Isi data & lampiran', 'Periksa & kirim'].map((t, i) => (
          <li key={t} className={langkah > i + 1 ? 'done' : langkah === i + 1 ? 'cur' : ''}>
            <span>{langkah > i + 1 ? <Icon name="check" /> : i + 1}</span>
            {t}
          </li>
        ))}
      </ol>

      {!jemaat && (
        <Alert tone="warn" style={{ marginBottom: 20 }}>
          Akun Anda belum tertaut ke data jemaat. Hubungi sekretariat gereja agar akun ditautkan sebelum mengajukan surat.
        </Alert>
      )}

      {ulang && (
        <Alert tone="bad" icon="arrow-repeat" style={{ marginBottom: 20 }}>
          <b>Mengajukan ulang {namaLayanan(ulang)}.</b> Catatan pengurus: {ulang.catatan || 'tidak ada catatan.'} Data lama sudah diisikan, silakan perbaiki.
        </Alert>
      )}

      <div className="pt-ajukan">
        <fieldset className="pt-pick" disabled={!jemaat}>
          <legend>1. Pilih layanan</legend>
          {LAYANAN.map((l) => {
            const alasan = alasanTidakBisa(l, jemaat);
            const on = pilihan === l.id;
            return (
              <label key={l.id} className={`pt-opt ${on ? 'on' : ''} ${alasan ? 'off' : ''}`}>
                <input type="radio" name="layanan" value={l.id} checked={on} disabled={!!alasan} onChange={() => pilih(l)} />
                <span className="pt-opt-ic">
                  <Icon name={l.icon} />
                </span>
                <span className="pt-opt-tx">
                  <b>{l.nama}</b>
                  <small>{alasan ?? l.ringkas}</small>
                </span>
                <span className="pt-opt-radio" aria-hidden="true" />
              </label>
            );
          })}
        </fieldset>

        <div className="pt-form gk-card" ref={formRef}>
          <h2 className="pt-form-title">2. Isi data permohonan</h2>
          {!layanan ? (
            <div className="pt-form-empty">
              <Icon name="hand-index" />
              <p>Pilih salah satu layanan di sebelah kiri untuk mulai mengisi formulir.</p>
            </div>
          ) : (
            <form
              key={layanan.id}
              className="form-stack pt-form-in"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (validasi()) setPeriksa(true);
              }}
            >
              <div className="pt-chosen">
                <Icon name={layanan.icon} /> {layanan.nama}
              </div>
              <div className="form-grid">
                <Field label="Nama pemohon" htmlFor="pemohon">
                  <input id="pemohon" className="input" value={jemaat?.nama ?? user.nama} readOnly />
                </Field>
                <Field label="Wilayah" htmlFor="wilayah">
                  <input id="wilayah" className="input" value={jemaat?.wilayah ?? '–'} readOnly />
                </Field>
                {layanan.fields.map((f) => {
                  const common = {
                    id: `f-${f.key}`,
                    className: `input ${errors[f.key] ? 'invalid' : ''}`,
                    placeholder: f.placeholder,
                    value: isian[f.key] ?? '',
                    'aria-invalid': !!errors[f.key],
                    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      const v = e.target.value;
                      setIsian((x) => ({ ...x, [f.key]: v }));
                      if (errors[f.key]) setErrors(({ [f.key]: _, ...rest }) => rest);
                    },
                  };
                  return (
                    <Field key={f.key} label={f.label} htmlFor={common.id} required={f.required} error={errors[f.key]} helperText={f.hint} className={f.type === 'textarea' ? 'full' : ''}>
                      {f.type === 'textarea' ? <textarea rows={3} {...common} /> : <input type={f.type} max={f.type === 'date' ? hariIniISO() : undefined} {...common} />}
                    </Field>
                  );
                })}
              </div>

              <Field label={`Lampiran: ${layanan.lampiran}`} required={layanan.lampiranWajib} error={errors.lampiran || fileErr}>
                {file ? (
                  <div className="file-row pt-file">
                    <span className="fi">
                      <Icon name={file.type === 'application/pdf' ? 'file-earmark-pdf' : 'file-earmark-image'} />
                    </span>
                    <span className="ft">
                      <b>{file.name}</b>
                      <small>{ukuran(file.size)} · siap dikirim</small>
                    </span>
                    <IconButton icon="x-lg" label="Hapus lampiran" danger onClick={() => setFile(null)} />
                  </div>
                ) : (
                  <FileDrop
                    id="lampiran"
                    accept=".pdf,image/jpeg,image/png"
                    allowedTypes={TIPE_LAMPIRAN}
                    maxMB={MAKS_MB}
                    icon="paperclip"
                    title="Klik atau seret berkas ke sini"
                    hint={`PDF, JPG, atau PNG · maks ${MAKS_MB} MB. Gabungkan beberapa dokumen menjadi satu PDF.`}
                    typeError="Format berkas harus PDF, JPG, atau PNG."
                    onFile={(f) => {
                      setFile(f);
                      setErrors(({ lampiran: _, ...rest }) => rest);
                    }}
                    onError={setFileErr}
                  />
                )}
              </Field>

              <div>
                <label className={`check pt-agree ${errors.setuju ? 'bad' : ''}`}>
                  <input
                    type="checkbox"
                    checked={setuju}
                    onChange={(e) => {
                      setSetuju(e.target.checked);
                      if (e.target.checked) setErrors(({ setuju: _, ...rest }) => rest);
                    }}
                  />
                  <span>Saya menyatakan data dan lampiran yang saya kirim benar.</span>
                </label>
                {errors.setuju && <div className="err">{errors.setuju}</div>}
              </div>

              <Button type="submit" block>
                Periksa permohonan <Icon name="arrow-right" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Periksa & kirim */}
      <Modal isOpen={periksa} onClose={() => !mengirim && setPeriksa(false)} title="Periksa sebelum mengirim" subtitle="Pastikan data sudah benar. Setelah dikirim, data tidak bisa diubah.">
        {layanan && (
          <>
            <dl className="dl pt-review">
              <div>
                <dt>Layanan</dt>
                <dd>{layanan.nama}</dd>
              </div>
              <div>
                <dt>Pemohon</dt>
                <dd>{jemaat?.nama}</dd>
              </div>
              {layanan.fields.map((f) =>
                (isian[f.key] ?? '').trim() ? (
                  <div key={f.key}>
                    <dt>{f.key}</dt>
                    <dd>{tampilIsi(isian[f.key])}</dd>
                  </div>
                ) : null
              )}
              <div>
                <dt>Lampiran</dt>
                <dd>{file ? namaBerkas(file.name) : 'Tidak ada'}</dd>
              </div>
            </dl>
            <div className="modal-acts">
              <Button variant="outline" onClick={() => setPeriksa(false)} disabled={mengirim}>
                Ubah lagi
              </Button>
              <Button onClick={kirim} isLoading={mengirim} icon="send">
                {mengirim ? 'Mengirim…' : 'Kirim permohonan'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};
