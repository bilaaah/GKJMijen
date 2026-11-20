'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, ButtonLink, Card, Icon, IconButton, PageHeader } from '@/components/common';
import { FileDrop, FormInput } from '@/components/forms';
import { Alert, EmptyState, useToast } from '@/components/feedback';
import { newId, unggahBerkas, useData, type StatusWarta } from '@/lib/data';
import { hariIniISO, namaBerkas } from '@/utils/formatters';
import { ROUTES } from '@/lib/constants/routes';
import { WartaPreview } from './WartaPreview';

const TOOLBAR: { icon: string; label: string; cmd: string; arg?: string }[] = [
  { icon: 'type-h2', label: 'Subjudul', cmd: 'formatBlock', arg: 'H3' },
  { icon: 'type-bold', label: 'Tebal', cmd: 'bold' },
  { icon: 'type-italic', label: 'Miring', cmd: 'italic' },
  { icon: 'list-ul', label: 'Daftar berpoin', cmd: 'insertUnorderedList' },
  { icon: 'list-ol', label: 'Daftar bernomor', cmd: 'insertOrderedList' },
  { icon: 'paragraph', label: 'Paragraf biasa', cmd: 'formatBlock', arg: 'P' },
];

/** Editor warta: judul, isi (rich text), lampiran PDF, simpan draf / terbitkan. */
export const WartaEditor: React.FC<{ id?: string }> = ({ id }) => {
  const { db, setDb, user } = useData();
  const router = useRouter();
  const toast = useToast();
  const existing = id ? db.warta.find((w) => w.id === id) : undefined;
  const isiRef = useRef<HTMLDivElement>(null);
  const [judul, setJudul] = useState(existing?.judul ?? '');
  const [tanggal, setTanggal] = useState(existing?.tanggal_terbit ?? '');
  const [pdf, setPdf] = useState(existing?.url_pdf ?? '');
  const [pdfSize, setPdfSize] = useState('');
  const [errors, setErrors] = useState<{ judul?: string; isi?: string; pdf?: string }>({});
  const [preview, setPreview] = useState(false);
  const [initialIsi] = useState(existing?.isi ?? '');
  const [mengunggah, setMengunggah] = useState(false);

  const unggahPdf = async (f: File) => {
    setMengunggah(true);
    const res = await unggahBerkas(f, 'warta');
    setMengunggah(false);
    if (!res.ok) return setErrors((e) => ({ ...e, pdf: res.message }));
    setPdf(res.url);
    setPdfSize(`${Math.round(f.size / 1024)} KB`);
  };

  if (id && !existing)
    return (
      <EmptyState
        title="Warta tidak ditemukan"
        description="Warta mungkin sudah dihapus."
        action={
          <ButtonLink href={ROUTES.DASHBOARD.WARTA} variant="outline">
            Kembali ke Daftar Warta
          </ButtonLink>
        }
      />
    );

  const status: StatusWarta = existing?.status ?? 'draf';
  const penulis = db.profiles.find((p) => p.id === (existing?.id_profiles ?? user?.id))?.nama ?? '';

  const simpan = (st: StatusWarta) => {
    const isi = isiRef.current?.innerHTML.trim() ?? '';
    const teks = isiRef.current?.textContent?.trim() ?? '';
    const er: typeof errors = {};
    if (!judul.trim()) er.judul = 'Judul warta wajib diisi.';
    if (!teks) er.isi = 'Isi warta masih kosong.';
    setErrors(er);
    if (er.judul || er.isi) return;
    const data = { judul: judul.trim(), isi, status: st, tanggal_terbit: st === 'terbit' ? tanggal || hariIniISO() : tanggal, url_pdf: pdf };
    setDb((d) => ({
      ...d,
      warta: existing ? d.warta.map((w) => (w.id === existing.id ? { ...w, ...data } : w)) : [...d.warta, { id: newId('w'), id_profiles: user?.id ?? '', ...data }],
    }));
    toast(st === 'terbit' ? 'Warta diterbitkan dan tampil di landing page.' : 'Draf warta tersimpan.');
    router.push(ROUTES.DASHBOARD.WARTA);
  };

  return (
    <>
      <PageHeader
        eyebrow="Jadwal & Warta"
        title={existing ? 'Ubah Warta' : 'Tulis Warta'}
        description={existing ? 'Perbarui isi warta, lalu simpan sebagai draf atau terbitkan.' : 'Mulai dengan judul, lalu tulis isi warta.'}
        actions={
          <ButtonLink href={ROUTES.DASHBOARD.WARTA} variant="outline" icon="arrow-left">
            Daftar Warta
          </ButtonLink>
        }
      />
      <div className="grid-editor">
        <Card>
          <input className={`input title-input ${errors.judul ? 'invalid' : ''}`} id="w-judul" placeholder="Judul warta" value={judul} onChange={(e) => setJudul(e.target.value)} aria-label="Judul warta" />
          {errors.judul && (
            <div className="err" style={{ margin: '-8px 0 12px' }}>
              {errors.judul}
            </div>
          )}
          <div className="toolbar" role="toolbar" aria-label="Format teks">
            {TOOLBAR.map((t) => (
              <IconButton key={t.label} icon={t.icon} label={t.label} onMouseDown={(e) => e.preventDefault()} onClick={() => document.execCommand(t.cmd, false, t.arg)} />
            ))}
          </div>
          <div
            ref={isiRef}
            className="rte"
            id="w-isi"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Isi warta"
            data-ph="Tulis isi warta di sini…"
            dangerouslySetInnerHTML={{ __html: initialIsi }}
          />
          {errors.isi && (
            <div className="err" style={{ marginTop: 8 }}>
              {errors.isi}
            </div>
          )}
          <div className="sec-label">Lampiran PDF</div>
          {pdf ? (
            <div className="file-row">
              <span className="fi">
                <Icon name="file-earmark-pdf" />
              </span>
              <div className="ft">
                <b>{namaBerkas(pdf)}</b>
                <small>PDF{pdfSize ? ` · ${pdfSize}` : ''} · tampil sebagai tombol unduh di halaman warta</small>
              </div>
              <div className="acts-inline">
                <label htmlFor="w-pdf-ganti" className="btn btn-outline-primary btn-sm">
                  Ganti
                </label>
                <IconButton icon="trash3" label="Hapus lampiran PDF" danger onClick={() => setPdf('')} />
              </div>
              <div hidden>
                <FileDrop
                  id="w-pdf-ganti"
                  accept="application/pdf"
                  allowedTypes={['application/pdf']}
                  maxMB={10}
                  icon="file-earmark-arrow-up"
                  title=""
                  hint=""
                  typeError="Lampiran warta harus berformat PDF."
                  onFile={(f) => unggahPdf(f)}
                  onError={(m) => setErrors((e) => ({ ...e, pdf: m || undefined }))}
                />
              </div>
            </div>
          ) : (
            <FileDrop
              id="w-pdf-file"
              accept="application/pdf"
              allowedTypes={['application/pdf']}
              maxMB={10}
              icon="file-earmark-arrow-up"
              title="Unggah warta versi PDF"
              hint="Opsional · PDF maks. 10 MB · seret ke sini atau klik untuk memilih"
              typeError="Lampiran warta harus berformat PDF."
              onFile={(f) => unggahPdf(f)}
              onError={(m) => setErrors((e) => ({ ...e, pdf: m || undefined }))}
            />
          )}
          {mengunggah && <small className="muted">Mengunggah PDF…</small>}
          {errors.pdf && (
            <div className="err" style={{ marginTop: 6 }}>
              {errors.pdf}
            </div>
          )}
        </Card>
        <Card className="side">
          <h3>Publikasi</h3>
          <dl className="dl" style={{ marginTop: 14 }}>
            <div>
              <dt>Status</dt>
              <dd>{status === 'terbit' ? <Badge tone="ok">Terbit</Badge> : <Badge tone="neu">Draf</Badge>}</dd>
            </div>
            <div>
              <dt>Penulis</dt>
              <dd>{penulis}</dd>
            </div>
          </dl>
          <div style={{ marginTop: 16 }}>
            <FormInput id="w-tgl" label="Tanggal Terbit" type="date" helperText="Kosongkan untuk memakai tanggal hari ini saat diterbitkan." value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>
          <div className="btns">
            <Button icon="send" onClick={() => simpan('terbit')}>
              {status === 'terbit' ? 'Simpan & Tetap Terbit' : 'Terbitkan'}
            </Button>
            <Button variant="outline" icon="floppy" onClick={() => simpan('draf')}>
              {status === 'terbit' ? 'Jadikan Draf' : 'Simpan Draf'}
            </Button>
            <Button variant="ghost" icon="eye" onClick={() => setPreview(true)}>
              Pratinjau
            </Button>
          </div>
          <Alert icon="globe2" style={{ marginTop: 16, fontSize: 13 }}>
            Warta berstatus Terbit langsung tampil di landing page dan halaman warta.
          </Alert>
        </Card>
      </div>
      <WartaPreview
        open={preview}
        onClose={() => setPreview(false)}
        judul={judul}
        isi={preview ? (isiRef.current?.innerHTML ?? '') : ''}
        tanggal={tanggal || hariIniISO()}
        penulis={penulis}
        pdf={pdf}
      />
    </>
  );
};
