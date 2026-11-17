import React from 'react';
import type { PermohonanSurat } from '../types';

export interface PermohonanSuratListProps {
  data: PermohonanSurat[];
}

export const PermohonanSuratList: React.FC<PermohonanSuratListProps> = ({ data }) => {
  return (
    <div className="border rounded p-3 text-center text-muted">
      <h6>Komponen PermohonanSuratList (Scaffolding)</h6>
      <p>Total permohonan surat: {data?.length || 0}</p>
    </div>
  );
};
