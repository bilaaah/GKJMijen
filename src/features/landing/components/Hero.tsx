'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/common';
import { useMock } from '@/lib/mock/store';
import { useNow } from '@/hooks/useInView';
import { formatHariTanggal, formatJam, parseTanggal } from '@/utils/formatters';
import { IBADAH_RUTIN } from '../content';

interface Berikut {
  nama: string;
  tanggal: string;
  jam: string;
  lokasi: string;
  waktu: Date;
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const keWaktu = (tgl: string, jam: string) => {
  const d = parseTanggal(tgl);
  const [h, m] = jam.split(':').map(Number);
  d.setHours(h, m);
  return d;
};

/** Ibadah terdekat: dari jadwal yang diisi pengurus; jika kosong, dari jadwal rutin Minggu. */
function cariIbadahBerikut(kegiatan: { nama_kegiatan: string; tanggal: string; jam: string; lokasi: string }[], now: Date): Berikut | null {
  const dariData = kegiatan
    .filter((k) => /ibadah/i.test(k.nama_kegiatan))
    .map((k) => ({ nama: k.nama_kegiatan, tanggal: k.tanggal, jam: k.jam, lokasi: k.lokasi, waktu: keWaktu(k.tanggal, k.jam) }))
    .filter((k) => k.waktu >= now)
    .sort((a, b) => +a.waktu - +b.waktu)[0];
  if (dariData) return dariData;

  const minggu = IBADAH_RUTIN.find((r) => r.hari === 0);
  if (!minggu) return null;
  for (let tambah = 0; tambah < 8; tambah++) {
    const d = new Date(now);
    d.setDate(d.getDate() + tambah);
    if (d.getDay() !== 0) continue;
    for (const it of minggu.items) {
      const w = keWaktu(iso(d), it.mulai);
      if (w >= now) return { nama: it.nama, tanggal: iso(d), jam: it.mulai, lokasi: 'Gedung Gereja GKJ Mijen', waktu: w };
    }
  }
  return null;
}

function sisaWaktu(target: Date, now: Date): string {
  const menit = Math.max(0, Math.round((+target - +now) / 60000));
  const hari = Math.floor(menit / 1440);
  const jam = Math.floor((menit % 1440) / 60);
  const m = menit % 60;
  if (menit < 1) return 'sedang dimulai';
  if (hari > 0) return `${hari} hari ${jam} jam lagi`;
  if (jam > 0) return `${jam} jam ${m} menit lagi`;
  return `${m} menit lagi`;
}

export const Hero: React.FC<{ onAjukan: () => void }> = ({ onAjukan }) => {
  const { db } = useMock();
  const now = useNow(30000);
  const berikut = useMemo(() => (now ? cariIbadahBerikut(db.kegiatan, now) : null), [db.kegiatan, now]);

  return (
    <section id="beranda" className="lp-hero">
      <div className="lp-hero-bg" aria-hidden="true">
        <Image src="/images/foto-gkj-mijen.jpeg" alt="" fill sizes="100vw" priority />
      </div>
      <div className="lp-hero-aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="lp-wrap lp-hero-in">
        <div className="lp-hero-tx">
          <p className="lp-hero-kicker">
            <span className="lp-kline" aria-hidden="true" /> Selamat datang di website resmi
          </p>
          <h1 aria-label="Gereja Kristen Jawa Mijen Semarang">
            <span className="ln sm" aria-hidden="true">
              <span>Gereja Kristen Jawa</span>
            </span>
            <span className="ln xl" aria-hidden="true">
              <span>Mijen</span>
            </span>
            <span className="ln md" aria-hidden="true">
              <span>Semarang</span>
            </span>
          </h1>
          <p className="lp-hero-lead">Bertumbuh dalam iman, kasih, dan pengharapan kepada Tuhan Yesus Kristus.</p>
          <div className="lp-hero-acts">
            <a href="#jadwal" className="btn btn-light">
              <Icon name="calendar3" /> Lihat jadwal pekan ini
            </a>
            <button type="button" className="btn btn-outline-light" onClick={onAjukan}>
              <Icon name="envelope-paper" /> Ajukan surat gerejawi
            </button>
          </div>
        </div>

        <div className="lp-hero-art">
          <svg className="lp-ring" viewBox="0 0 300 390" aria-hidden="true" preserveAspectRatio="none">
            <path d="M6 384 V150 A144 144 0 0 1 294 150 V384 Z" pathLength={100} />
          </svg>
          <div className="lp-arch">
            <Image src="/images/foto-gkj-mijen.jpeg" alt="Gedung GKJ Mijen Semarang dengan salib merah di fasad" fill sizes="(max-width: 900px) 70vw, 360px" priority />
          </div>

          <div className="lp-next" aria-live="polite">
            <div className="lp-next-k">
              <span className="lp-pulse" aria-hidden="true" /> Ibadah berikutnya
            </div>
            {berikut ? (
              <>
                <b>{berikut.nama}</b>
                <span className="lp-next-when">
                  {formatHariTanggal(berikut.tanggal)} · {formatJam(berikut.jam)} WIB
                </span>
                <span className="lp-next-left">
                  <Icon name="hourglass-split" /> {now && sisaWaktu(berikut.waktu, now)}
                </span>
              </>
            ) : (
              <span className="lp-next-when">Memuat jadwal…</span>
            )}
          </div>
        </div>
      </div>
      <a href="#tentang" className="lp-scroll" aria-label="Gulir ke bawah">
        <Icon name="chevron-down" />
      </a>
    </section>
  );
};
