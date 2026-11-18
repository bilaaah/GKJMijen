import React from 'react';
import type { Jemaat } from '../types';

interface JemaatListProps {
  data?: Jemaat[];
}

/**
 * Modul Data Jemaat - Komponen Daftar Jemaat (Frontend)
 * Placeholder UI tabel/list data jemaat.
 */
export const JemaatList: React.FC<JemaatListProps> = ({ data = [] }) => {
  return (
    <div className="card shadow-sm border-0 p-3">
      <h6 className="card-title text-muted mb-3">Daftar Data Jemaat (Placeholder UI)</h6>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Nomor Induk</th>
              <th>Nama Lengkap</th>
              <th>Jenis Kelamin</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  Belum ada data jemaat yang ditampilkan.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.nomorInduk}</td>
                  <td>{item.namaLengkap}</td>
                  <td>{item.jenisKelamin}</td>
                  <td>{item.statusJemaat}</td>
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
