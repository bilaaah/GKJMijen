import React from 'react';
import type { TransaksiKeuangan } from '../types';

export interface TransaksiTableProps {
  data: TransaksiKeuangan[];
}

export const TransaksiTable: React.FC<TransaksiTableProps> = ({ data }) => {
  return (
    <div className="border rounded p-3 text-center text-muted">
      <h6>Komponen TransaksiTable (Scaffolding)</h6>
      <p>Total transaksi tercatat: {data?.length || 0}</p>
    </div>
  );
};
