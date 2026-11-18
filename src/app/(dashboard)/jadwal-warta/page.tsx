import { JadwalWartaList } from '@/features/jadwal-warta';

export default function JadwalWartaPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Jadwal dan Warta</h2>
          <p className="text-muted mb-0">Modul jadwal ibadah, kegiatan gereja, dan publikasi warta jemaat.</p>
        </div>
      </div>
      <JadwalWartaList jadwalList={[]} wartaList={[]} />
    </div>
  );
}
