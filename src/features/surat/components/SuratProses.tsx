'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ButtonLink, Card, Icon, IconButton, Modal, PageHeader, Person, YesNoBadge } from '@/components/common';
import { Field, FileDrop, FormInput, FormTextarea, RadioPills } from '@/components/forms';
import { Alert, EmptyState, useToast } from '@/components/feedback';
import { bukaBerkas, unggahBerkas, useData, JENIS_SURAT_LABEL, STATUS_SURAT, STATUS_SURAT_LABEL, STATUS_SURAT_TONE, type PermohonanSurat, type StatusSurat } from '@/lib/data';
import { formatHariTanggal, formatTanggalPendek, namaBerkas } from '@/utils/formatters';
import { ROUTES, routeJemaatDetail } from '@/lib/constants/routes';
import { bacaKeterangan, namaLayanan, tampilIsi } from '@/features/portal/layanan';
import { usulanNomor } from '../kop-surat';
import { buatSuratPdf, namaBerkasSurat } from '../surat-pdf';

const Timeline: React.FC<{ s: PermohonanSurat }> = ({ s }) => {
  const rejected = s.status === 'ditolak';
  const steps: StatusSurat[] = rejected ? ['diajukan', 'ditolak'] : ['diajukan', 'diproses', 'selesai'];
  const cur = steps.indexOf(s.status);
  const icons = ['send', 'hourglass-split', 'file-earmark-check'];
  return (
    <div className="timeline">
      {steps.map((st, i) => {
        const isRej = rejected && i === 1;
        const done = i < cur || (st === 'selesai' && i === cur);
        const cls = isRej ? 'rej' : done ? 'done' : i === cur ? 'cur' : '';
        return (
          <div className={`tl-step ${cls}`} key={st}>
            <span className="tl-dot">
              <Icon name={isRej ? 'x-lg' : done ? 'check-lg' : icons[i]} />
            </span>
            <b>{STATUS_SURAT_LABEL[st]}</b>
            <small>{i === 0 ? formatTanggalPendek(s.tanggal_pengajuan) : i === cur ? 'Status saat ini' : 'Menunggu'}</small>
          </div>
        );
      })}
    </div>
  );
};

/** Halaman memproses satu permohonan surat: ubah status, nomor surat, unggah PDF, catatan. */
export const SuratProses: React.FC<{ id: string }> = ({ id }) => {
  const { db, setDb, user } = useData();
  const router = useRouter();
  const toast = useToast();
  const s = db.surat.find((x) => x.id === id);
  const [status, setStatus] = useState<StatusSurat>(s?.status ?? 'diajukan');
  const [nomor, setNomor] = useState(s?.nomor_surat ?? '');
  const [catatan, setCatatan] = useState(s?.catatan ?? '');
  const [fileBaru, setFileBaru] = useState('');
  const [urlBaru, setUrlBaru] = useState('');
  const [mengunggah, setMengunggah] = useState(false);
  const [errors, setErrors] = useState<{ nomor?: string; file?: string; catatan?: string }>({});
  const [preview, setPreview] = useState<'lampiran' | 'surat' | null>(null);
  /** Draf surat otomatis yang sedang dipratinjau (belum diunggah). */
  const [draf, setDraf] = useState<{ url: string; file: File; nomor: string } | null>(null);
  const [membuat, setMembuat] = useState(false);

  if (!s)
    return (
      <EmptyState
        title="Permohonan tidak ditemukan"
        description="Permohonan mungkin sudah dihapus."
        action={
          <ButtonLink href={ROUTES.DASHBOARD.SURAT} variant="outline">
            Kembali ke Daftar
          </ButtonLink>
        }
      />
    );

  const j = db.jemaat.find((x) => x.id === s.id_jemaat);
  const fileSurat = fileBaru || namaBerkas(s.url_surat);
  const nomorUsulan = usulanNomor(db.surat.filter((x) => x.id !== s.id));

  /** Buat PDF surat resmi dari template (kop, Times 12 pt, rata kanan-kiri) lalu tampilkan pratinjaunya. */
  const buatOtomatis = async () => {
    if (!j) return;
    const no = nomor.trim() || nomorUsulan;
    setNomor(no);
    setErrors((e) => ({ ...e, nomor: undefined, file: undefined }));
    setMembuat(true);
    try {
      const isi = await buatSuratPdf({ s, j, nomor: no, tanggal: new Date() });
      const file = new File([isi], namaBerkasSurat(s, j), { type: 'application/pdf' });
      setDraf({ url: URL.createObjectURL(file), file, nomor: no });
    } catch (e) {
      toast(`Surat gagal dibuat: ${e instanceof Error ? e.message : String(e)}`, 'bad');
    } finally {
      setMembuat(false);
    }
  };

  /** Pakai draf: unggah ke bucket "surat" (folder akun warga) lalu siapkan status Selesai. */
  const pakaiDraf = async () => {
    if (!draf) return;
    setMengunggah(true);
    const res = await unggahBerkas(draf.file, 'surat', j?.id_profiles ?? undefined);
    setMengunggah(false);
    if (!res.ok) {
      toast(res.message, 'bad');
      return;
    }
    setUrlBaru(res.url);
    setFileBaru(draf.file.name);
    setNomor(draf.nomor);
    setStatus('selesai');
    URL.revokeObjectURL(draf.url);
    setDraf(null);
    toast('Surat siap. Klik "Simpan Perubahan" untuk menerbitkannya ke warga.');
  };

  const tutupDraf = () => {
    if (draf) URL.revokeObjectURL(draf.url);
    setDraf(null);
  };

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (status === 'ditolak' && !catatan.trim()) er.catatan = 'Tuliskan alasan penolakan agar pemohon tahu apa yang perlu diperbaiki.';
    if (status === 'selesai' && !nomor.trim()) er.nomor = 'Isi nomor surat sebelum menandai Selesai.';
    if (status === 'selesai' && !fileSurat) er.file = 'Unggah surat final (PDF) sebelum menandai Selesai.';
    setErrors(er);
    if (Object.keys(er).length) return;
    setDb((d) => ({
      ...d,
      surat: d.surat.map((x) =>
        x.id === s.id ? { ...x, status, nomor_surat: nomor.trim(), catatan: catatan.trim(), id_pengurus: user?.id ?? x.id_pengurus, url_surat: urlBaru || x.url_surat } : x
      ),
    }));
    toast(`Permohonan ${j?.nama ?? ''} kini berstatus ${STATUS_SURAT_LABEL[status]}.`);
    router.push(ROUTES.DASHBOARD.SURAT);
  };

  return (
    <>
      <PageHeader
        eyebrow="Pelayanan · Permohonan Surat"
        title={`${JENIS_SURAT_LABEL[s.jenis_surat]} · ${j?.nama ?? '–'}`}
        description={`Diajukan ${formatHariTanggal(s.tanggal_pengajuan)}`}
        actions={
          <ButtonLink href={ROUTES.DASHBOARD.SURAT} variant="outline" icon="arrow-left">
            Daftar Permohonan
          </ButtonLink>
        }
      />
      <Timeline s={s} />
      <div className="grid-proses">
        <div className="stack">
          <Card
            title="Data Pemohon"
            aside={
              j && (
                <button type="button" className="link" onClick={() => router.push(routeJemaatDetail(j.id))}>
                  Data lengkap
                </button>
              )
            }
          >
            {j ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Person name={j.nama} sub={j.wilayah} size="md" />
                </div>
                <dl className="dl">
                  <div>
                    <dt>No. HP</dt>
                    <dd>{j.no_hp || '–'}</dd>
                  </div>
                  <div>
                    <dt>Alamat</dt>
                    <dd>{j.alamat}</dd>
                  </div>
                  <div>
                    <dt>Status baptis</dt>
                    <dd>
                      <YesNoBadge value={j.status_baptis} />
                    </dd>
                  </div>
                  <div>
                    <dt>Status sidi</dt>
                    <dd>
                      <YesNoBadge value={j.status_sidi} />
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="muted">Data jemaat pemohon tidak ditemukan.</p>
            )}
          </Card>
          {/* Isian formulir yang dikirim warga dari portal (kolom permohonan_surat.keterangan) */}
          <Card title="Isian Formulir Pemohon" aside={<span className="muted">{namaLayanan(s)}</span>}>
            {bacaKeterangan(s).length ? (
              <dl className="dl">
                {bacaKeterangan(s).map((b) => (
                  <div key={b.label}>
                    <dt>{b.label}</dt>
                    <dd>{tampilIsi(b.isi)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="muted">Tidak ada isian tambahan dari pemohon.</p>
            )}
          </Card>
          <Card title="Lampiran Permohonan">
            <div className="file-row">
              <span className="fi">
                <Icon name="paperclip" />
              </span>
              <div className="ft">
                <b>{namaBerkas(s.url_lampiran)}</b>
                <small>PDF · diunggah pemohon</small>
              </div>
              <div className="acts-inline">
                <Button size="sm" variant="ghost" icon="eye" onClick={() => setPreview('lampiran')}>
                  Pratinjau
                </Button>
                <IconButton icon="download" label="Unduh lampiran" onClick={() => bukaBerkas(s.url_lampiran) || toast(`Berkas ${namaBerkas(s.url_lampiran) || 'lampiran'} belum tersedia.`, 'info')} />
              </div>
            </div>
            {s.url_surat && (
              <>
                <div className="sec-label">Surat final</div>
                <div className="file-row">
                  <span className="fi ok">
                    <Icon name="file-earmark-check" />
                  </span>
                  <div className="ft">
                    <b>{namaBerkas(s.url_surat)}</b>
                    <small>No. {s.nomor_surat} · dapat diunduh warga</small>
                  </div>
                  <Button size="sm" variant="ghost" icon="eye" onClick={() => setPreview('surat')}>
                    Pratinjau
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
        <Card>
          <h3>Proses Permohonan</h3>
          <p className="muted" style={{ margin: 0 }}>
            Ubah status, isi nomor surat, lalu unggah surat final.
          </p>
          <form className="form-stack" style={{ marginTop: 16 }} onSubmit={simpan} noValidate>
            <Field label="Status">
              <RadioPills<StatusSurat>
                name="status"
                value={status}
                onChange={(v) => setStatus(v)}
                options={STATUS_SURAT.map((st) => ({ value: st, label: STATUS_SURAT_LABEL[st], dot: STATUS_SURAT_TONE[st] }))}
              />
            </Field>
            <FormInput
              id="nomor_surat"
              label="Nomor Surat"
              className="num"
              placeholder={`usulan: ${nomorUsulan}`}
              helperText="Format gereja: urut/GKJ-MJ/bulan romawi/tahun. Terisi otomatis saat membuat surat."
              value={nomor}
              onChange={(e) => setNomor(e.target.value)}
              error={errors.nomor}
            />
            <Field label="Surat Resmi Otomatis" helperText="Kop gereja, Times New Roman 12 pt, rata kanan-kiri, diisi dari data jemaat dan formulir pemohon.">
              <Button type="button" variant="outline" icon="file-earmark-text" block disabled={!j || membuat || mengunggah} onClick={buatOtomatis}>
                {membuat ? 'Menyusun surat…' : 'Buat Surat Otomatis'}
              </Button>
            </Field>
            <Field label="Atau Unggah Surat Final (PDF)" error={errors.file}>
              {fileSurat && (
                <div className="file-row" style={{ marginBottom: 8 }}>
                  <span className="fi ok">
                    <Icon name="file-earmark-pdf" />
                  </span>
                  <div className="ft">
                    <b>{fileSurat}</b>
                    <small>{fileBaru ? 'Berkas baru sudah terunggah, tersimpan setelah Simpan' : 'Surat final saat ini'}</small>
                  </div>
                </div>
              )}
              <FileDrop
                id="surat-file"
                accept="application/pdf"
                allowedTypes={['application/pdf']}
                maxMB={5}
                icon="cloud-arrow-up"
                title={fileSurat ? 'Ganti dengan berkas PDF lain' : 'Seret berkas PDF ke sini'}
                hint="atau klik untuk memilih berkas · maks. 5 MB"
                typeError="Berkas harus berformat PDF."
                onFile={async (f) => {
                  setMengunggah(true);
                  // Disimpan di folder milik akun warga pemohon, supaya warga bisa mengunduh suratnya sendiri
                  const res = await unggahBerkas(f, 'surat', j?.id_profiles ?? undefined);
                  setMengunggah(false);
                  if (!res.ok) return setErrors((e) => ({ ...e, file: res.message }));
                  setUrlBaru(res.url);
                  setFileBaru(f.name);
                }}
                onError={(m) => setErrors((e) => ({ ...e, file: m || undefined }))}
              />
            </Field>
            <FormTextarea
              id="catatan"
              label={status === 'ditolak' ? 'Catatan (wajib jika ditolak)' : 'Catatan'}
              required={status === 'ditolak'}
              rows={3}
              placeholder="Catatan untuk pemohon, misalnya alasan penolakan atau kelengkapan yang kurang"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              error={errors.catatan}
            />
            <Alert>Persetujuan pendeta atau majelis dilakukan sebelum status diubah menjadi Selesai.</Alert>
            {mengunggah && <small className="muted">Mengunggah surat…</small>}
            <Button type="submit" icon="check-lg" block disabled={mengunggah}>
              Simpan Perubahan
            </Button>
          </form>
        </Card>
      </div>

      <Modal
        isOpen={!!draf}
        onClose={tutupDraf}
        size="lg"
        title="Pratinjau Surat Otomatis"
        subtitle={draf ? `${draf.file.name} · Nomor ${draf.nomor}` : ''}
        footer={
          <>
            <Button variant="outline" onClick={tutupDraf}>
              Batal
            </Button>
            <Button variant="outline" icon="box-arrow-up-right" onClick={() => draf && bukaBerkas(draf.url)}>
              Buka di tab baru
            </Button>
            <Button icon="check-lg" disabled={mengunggah} onClick={pakaiDraf}>
              {mengunggah ? 'Mengunggah…' : 'Gunakan Surat Ini'}
            </Button>
          </>
        }
      >
        {draf && (
          <>
            <iframe src={draf.url} title="Pratinjau surat" style={{ width: '100%', height: '70vh', border: '1px solid var(--line, #e5ddd3)', borderRadius: 8 }} />
            <p className="muted" style={{ fontSize: 13, margin: '8px 0 0' }}>
              Pratinjau tidak tampil (misalnya di ponsel)? Klik <b>Buka di tab baru</b> untuk melihat suratnya.
            </p>
          </>
        )}
      </Modal>

      <Modal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        size="lg"
        title={preview === 'surat' ? JENIS_SURAT_LABEL[s.jenis_surat] : 'Lampiran Permohonan'}
        subtitle={namaBerkas(preview === 'surat' ? s.url_surat : s.url_lampiran)}
        footer={
          <>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Tutup
            </Button>
            <Button icon="download" onClick={() => bukaBerkas(preview === 'surat' ? s.url_surat : s.url_lampiran) || toast('Berkas belum tersedia.', 'info')}>
              Unduh
            </Button>
          </>
        }
      >
        <div className="doc-prev">
          <div className="doc-page">
            <div className="dh">
              GEREJA KRISTEN JAWA MIJEN
              <br />
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em' }}>SEMARANG</span>
            </div>
            <div className="dt">{preview === 'surat' ? JENIS_SURAT_LABEL[s.jenis_surat].toUpperCase() : 'DOKUMEN PENDUKUNG'}</div>
            {preview === 'surat' && <div style={{ textAlign: 'center' }}>Nomor: {s.nomor_surat}</div>}
            <div style={{ marginTop: 10 }}>
              Nama: <b>{j?.nama}</b>
            </div>
            <div>Wilayah: {j?.wilayah}</div>
            <div className="doc-line" />
            <div className="doc-line" />
            <div className="doc-line" />
            <div className="doc-line" style={{ width: '70%' }} />
            <div className="doc-line" />
            <div className="doc-line" style={{ width: '55%' }} />
            <div style={{ marginTop: 'auto', textAlign: 'right' }}>
              Mijen, {formatTanggalPendek(s.tanggal_pengajuan)}
              <br />
              <br />
              <br />
              {preview === 'surat' ? 'Pdt. Denny Irawan, S.Si-Teol' : j?.nama}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
