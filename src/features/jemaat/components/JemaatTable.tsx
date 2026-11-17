import React from 'react';
import type { Jemaat } from '../types';

export interface JemaatTableProps {
  data: Jemaat[];
  isLoading?: boolean;
}

export const JemaatTable: React.FC<JemaatTableProps> = ({ data, isLoading }) => {
  return (
    <div className="table-placeholder border rounded p-3 text-center text-muted">
      <h6>Komponen JemaatTable (Scaffolding)</h6>
      <p>Data jemaat: {data?.length || 0} entri. Status loading: {String(isLoading)}</p>
    </div>
  );
};
