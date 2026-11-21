'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, IconButton } from '@/components/common';

/** Slot petugas yang selalu ada di Ibadah Minggu. */
export const TEMPLATE_IBADAH_MINGGU = ['Pengkhotbah', 'Liturgos', 'Pemusik', 'Kolektan'];

/** Usulan peran untuk petugas tambahan. */
const USULAN_PERAN = ['Multimedia', 'Tim Doa', 'Paduan Suara', 'Pamuji', 'Penerima Tamu', 'Sound System', 'Pembaca Warta'];

interface Baris {
  id: number;
  peran: string;
  nama: string;
  /** true = slot dari template (label tetap), false = petugas tambahan (peran bisa diketik). */
  template: boolean;
}

let seq = 0;
const baris = (peran: string, nama: string, template: boolean): Baris => ({ id: ++seq, peran, nama, template });

/** "Peran: Nama" per baris → daftar baris editor. */
function urai(teks: string): Baris[] {
  return teks
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(':');
      const peran = i >= 0 ? l.slice(0, i).trim() : '';
      const nama = i >= 0 ? l.slice(i + 1).trim() : l;
      return baris(peran, nama, TEMPLATE_IBADAH_MINGGU.includes(peran));
    });
}

/**
 * Daftar baris → teks "Peran: Nama" per baris (format kolom kegiatan.petugas).
 * Baris tanpa nama tidak disimpan; peran kosong diberi label "Petugas".
 */
function susun(rows: Baris[]): string {
  return rows
    .filter((r) => r.nama.trim())
    .map((r) => `${r.peran.trim() || 'Petugas'}: ${r.nama.trim()}`)
    .join('\n');
}

export interface PetugasEditorProps {
  /** Isi awal dalam format "Peran: Nama" per baris. */
  value: string;
  onChange: (teks: string) => void;
  /** Daftar nama untuk saran isian (mis. nama jemaat). */
  saranNama?: string[];
}

/**
 * Editor petugas kegiatan:
 * - tombol "Gunakan Template Ibadah Minggu" memunculkan slot Pengkhotbah, Liturgos, Pemusik, Kolektan;
 * - tombol "+ Tambah Petugas Tambahan" untuk peran lain (Multimedia, Tim Doa, dst.).
 */
export const PetugasEditor: React.FC<PetugasEditorProps> = ({ value, onChange, saranNama = [] }) => {
  const [rows, setRows] = useState<Baris[]>(() => urai(value));
  const fokusId = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Arahkan kursor ke kolom yang baru dimunculkan
  useEffect(() => {
    if (fokusId.current == null) return;
    wrapRef.current?.querySelector<HTMLInputElement>(`[data-fokus="${fokusId.current}"]`)?.focus();
    fokusId.current = null;
  }, [rows]);

  const ubah = (next: Baris[]) => {
    setRows(next);
    onChange(susun(next));
  };

  const pakaiTemplate = () => {
    const ada = new Set(rows.map((r) => r.peran.toLowerCase()));
    const baru = TEMPLATE_IBADAH_MINGGU.filter((p) => !ada.has(p.toLowerCase())).map((p) => baris(p, '', true));
    // Slot template ditaruh di atas, petugas lain di bawahnya
    const urut = [...rows.filter((r) => r.template), ...baru, ...rows.filter((r) => !r.template)];
    const kosong = urut.find((r) => r.template && !r.nama);
    if (kosong) fokusId.current = kosong.id;
    ubah(urut);
  };

  const tambah = () => {
    const r = baris('', '', false);
    fokusId.current = r.id;
    ubah([...rows, r]);
  };

  const set = (id: number, patch: Partial<Baris>) => ubah(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const hapus = (id: number) => ubah(rows.filter((r) => r.id !== id));

  const templateLengkap = TEMPLATE_IBADAH_MINGGU.every((p) => rows.some((r) => r.peran.toLowerCase() === p.toLowerCase()));

  return (
    <div className="petugas" ref={wrapRef}>
      {!templateLengkap && (
        <button type="button" className="petugas-template" onClick={pakaiTemplate}>
          <span className="ic-circle">
            <i className="bi bi-magic" aria-hidden="true" />
          </span>
          <span>
            <b>Gunakan Template Ibadah Minggu</b>
            <small>Munculkan kolom {TEMPLATE_IBADAH_MINGGU.join(', ')}</small>
          </span>
        </button>
      )}

      {rows.length > 0 && (
        <div className="petugas-list">
          {rows.map((r) =>
            r.template ? (
              <div className="petugas-row" key={r.id}>
                <label className="petugas-label" htmlFor={`petugas-${r.id}`}>
                  {r.peran}
                </label>
                <input
                  id={`petugas-${r.id}`}
                  data-fokus={r.id}
                  className="input"
                  list="saran-nama-petugas"
                  placeholder={`Nama ${r.peran.toLowerCase()}`}
                  value={r.nama}
                  onChange={(e) => set(r.id, { nama: e.target.value })}
                />
                <IconButton icon="x-lg" label={`Hapus ${r.peran}`} danger onClick={() => hapus(r.id)} />
              </div>
            ) : (
              <div className="petugas-row tambahan" key={r.id}>
                <input
                  className="input petugas-peran"
                  data-fokus={r.id}
                  list="usulan-peran-petugas"
                  placeholder="Peran, mis. Multimedia"
                  aria-label="Peran petugas tambahan"
                  value={r.peran}
                  onChange={(e) => set(r.id, { peran: e.target.value })}
                />
                <input
                  className="input"
                  list="saran-nama-petugas"
                  placeholder="Nama petugas"
                  aria-label={`Nama ${r.peran || 'petugas tambahan'}`}
                  value={r.nama}
                  onChange={(e) => set(r.id, { nama: e.target.value })}
                />
                <IconButton icon="x-lg" label={`Hapus ${r.peran || 'petugas tambahan'}`} danger onClick={() => hapus(r.id)} />
              </div>
            )
          )}
        </div>
      )}

      <Button variant="ghost" size="sm" icon="plus-lg" onClick={tambah} className="petugas-add">
        Tambah Petugas Tambahan
      </Button>

      <datalist id="usulan-peran-petugas">
        {USULAN_PERAN.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <datalist id="saran-nama-petugas">
        {saranNama.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
    </div>
  );
};
