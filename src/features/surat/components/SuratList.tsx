import React from 'react';
import type { SuratPermohonan } from '../types';

interface SuratListProps {
  data?: SuratPermohonan[];
}

/**
 * Modul Layanan Surat - Komponen Daftar Permohonan Surat (Frontend)
 * Placeholder UI daftar dan status permohonan surat jemaat.
 */
export const SuratList: React.FC<SuratListProps> = ({ data = [] }) => {
  return (
    <div className="card shadow-sm border-0 p-3">
      <h6 className="card-title text-muted mb-3">Daftar Permohonan Surat (Placeholder UI)</h6>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>No. Permohonan</th>
              <th>Jenis Surat</th>
              <th>Nama Pemohon</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  Belum ada data permohonan surat.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.nomorPermohonan}</td>
                  <td>{item.jenisSurat}</td>
                  <td>{item.namaPemohon}</td>
                  <td>
                    <span className="badge bg-secondary">{item.status}</span>
                  </td>
                  <td>-</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
