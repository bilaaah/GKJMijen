'use client';

import React, { useState } from 'react';
import { Icon } from '../common/Icon';

export interface FileDropProps {
  id: string;
  accept: string;
  /** Daftar MIME type yang diterima, mis. ['image/png','image/jpeg']. */
  allowedTypes: string[];
  maxMB: number;
  icon: string;
  title: string;
  hint: string;
  typeError: string;
  onFile: (file: File) => void;
  onError: (message: string) => void;
}

/**
 * Kotak unggah berkas: bisa diklik atau diseret (drag & drop).
 * Validasi tipe dan ukuran dilakukan di sini sebelum onFile dipanggil.
 * TODO [Backend]: unggah ke Supabase Storage di dalam onFile.
 */
export const FileDrop: React.FC<FileDropProps> = ({ id, accept, allowedTypes, maxMB, icon, title, hint, typeError, onFile, onError }) => {
  const [over, setOver] = useState(false);

  const handle = (file?: File) => {
    if (!file) return;
    const okType = allowedTypes.includes(file.type) || (allowedTypes.includes('application/pdf') && /\.pdf$/i.test(file.name));
    if (!okType) return onError(typeError);
    if (file.size > maxMB * 1024 * 1024) return onError(`Ukuran berkas maksimal ${maxMB} MB.`);
    onError('');
    onFile(file);
  };

  return (
    <label
      className={`drop ${over ? 'over' : ''}`}
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files[0]);
      }}
    >
      <input
        type="file"
        id={id}
        accept={accept}
        hidden
        onChange={(e) => {
          handle(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <span className="ic-circle">
        <Icon name={icon} />
      </span>
      <b>{title}</b>
      <span className="hint">{hint}</span>
    </label>
  );
};

/** Baca berkas gambar menjadi data URL untuk pratinjau. */
export function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
