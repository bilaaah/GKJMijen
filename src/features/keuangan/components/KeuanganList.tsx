import React from 'react';
import type { Transaksi } from '../types';

interface KeuanganListProps {
  data?: Transaksi[];
}

/**
 * Modul Keuangan - Komponen Daftar Transaksi (Frontend)
 * Placeholder UI tabel transaksi kas pemasukan dan pengeluaran.
 */
export const KeuanganList: React.FC<KeuanganListProps> = ({ data = [] }) => {
  return (
    <div className="card shadow-sm border-0 p-3">
      <h6 className="card-title text-muted mb-3">Catatan Transaksi Keuangan (Placeholder UI)</h6>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>No. Transaksi</th>
              <th>Tanggal</th>
              <th>Tipe</th>
              <th>Kategori</th>
              <th>Jumlah (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  Belum ada catatan transaksi keuangan.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.nomorTransaksi}</td>
                  <td>{item.tanggal}</td>
                  <td>
                    <span className={`badge ${item.tipe === 'pemasukan' ? 'bg-success' : 'bg-danger'}`}>
                      {item.tipe}
                    </span>
                  </td>
                  <td>{item.kategori}</td>
                  <td>{item.jumlah.toLocaleString('id-ID')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
