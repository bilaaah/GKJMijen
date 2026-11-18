import React from 'react';
import type { JadwalKegiatan, WartaJemaat } from '../types';

interface JadwalWartaListProps {
  jadwalList?: JadwalKegiatan[];
  wartaList?: WartaJemaat[];
}

/**
 * Modul Jadwal dan Warta - Komponen Tampilan Jadwal & Warta (Frontend)
 * Placeholder UI jadwal kebaktian dan arsip warta gereja.
 */
export const JadwalWartaList: React.FC<JadwalWartaListProps> = ({
  jadwalList = [],
  wartaList = [],
}) => {
  return (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="card shadow-sm border-0 p-3 h-100">
          <h6 className="card-title text-muted mb-3">Jadwal Kebaktian & Kegiatan (Placeholder)</h6>
          <ul className="list-group list-group-flush">
            {jadwalList.length === 0 ? (
              <li className="list-group-item text-muted text-center py-3">
                Belum ada jadwal kegiatan.
              </li>
            ) : (
              jadwalList.map((j) => (
                <li key={j.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{j.judul}</strong>
                    <div className="small text-muted">{j.waktu} - {j.lokasi}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow-sm border-0 p-3 h-100">
          <h6 className="card-title text-muted mb-3">Warta Jemaat Mingguan (Placeholder)</h6>
          <ul className="list-group list-group-flush">
            {wartaList.length === 0 ? (
              <li className="list-group-item text-muted text-center py-3">
                Belum ada warta yang diterbitkan.
              </li>
            ) : (
              wartaList.map((w) => (
                <li key={w.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Edisi {w.edisi}</strong>
                    <div className="small text-muted">{w.tanggalTerbit}</div>
                  </div>
                  <button className="btn btn-sm btn-outline-primary" disabled>Unduh PDF</button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
