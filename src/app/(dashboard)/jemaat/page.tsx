import { JemaatList } from '@/features/jemaat';

export default function JemaatPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Data Jemaat</h2>
          <p className="text-muted mb-0">Modul pengelolaan data dan sensus warga GKJ Mijen.</p>
        </div>
      </div>
      <JemaatList data={[]} />
    </div>
  );
}
