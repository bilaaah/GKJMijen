import { SuratList } from '@/features/surat';

export default function SuratPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Layanan Surat</h2>
          <p className="text-muted mb-0">Modul permohonan dan penerbitan surat jemaat.</p>
        </div>
      </div>
      <SuratList data={[]} />
    </div>
  );
}
