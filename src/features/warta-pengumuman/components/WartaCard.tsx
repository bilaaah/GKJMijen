import React from 'react';
import type { WartaJemaat } from '../types';

export interface WartaCardProps {
  warta: WartaJemaat;
}

export const WartaCard: React.FC<WartaCardProps> = ({ warta }) => {
  return (
    <div className="card shadow-sm p-3 mb-2">
      <h6 className="card-title">Edisi: {warta.edisi}</h6>
      <p className="card-text text-muted">Tanggal: {warta.tanggal_terbit}</p>
    </div>
  );
};
