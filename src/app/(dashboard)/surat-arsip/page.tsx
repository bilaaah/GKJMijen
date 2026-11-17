import { PermohonanSuratList } from '@/features/surat-arsip';

export default function SuratArsipIndexPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Layanan Surat & Arsip</h2>
      <p className="text-muted">Pusat pengelolaan permohonan surat jemaat dan pengarsipan gereja.</p>
      <PermohonanSuratList data={[]} />
    </div>
  );
}
