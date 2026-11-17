import { JadwalCalendar } from '@/features/jadwal-kegiatan';

export default function JadwalKegiatanIndexPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Jadwal & Agenda Kegiatan</h2>
      <p className="text-muted">Jadwal kebaktian, rapat komisi, dan agenda pembinaan jemaat.</p>
      <JadwalCalendar events={[]} />
    </div>
  );
}
