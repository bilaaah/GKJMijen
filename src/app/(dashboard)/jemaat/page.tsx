import { JemaatTable } from '@/features/jemaat';

export default function JemaatIndexPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Data Jemaat</h2>
          <p className="text-muted mb-0">Kelola master data warga jemaat GKJ Mijen.</p>
        </div>
      </div>
      <JemaatTable data={[]} isLoading={false} />
    </div>
  );
}
