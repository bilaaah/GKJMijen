import React from 'react';
import type { JadwalKegiatan } from '../types';

export interface JadwalCalendarProps {
  events: JadwalKegiatan[];
}

export const JadwalCalendar: React.FC<JadwalCalendarProps> = ({ events }) => {
  return (
    <div className="border rounded p-3 text-center text-muted">
      <h6>Komponen JadwalCalendar (Scaffolding)</h6>
      <p>Total jadwal kegiatan: {events?.length || 0}</p>
    </div>
  );
};
