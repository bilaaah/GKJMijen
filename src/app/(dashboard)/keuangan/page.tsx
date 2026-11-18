import { KeuanganList } from '@/features/keuangan';

export default function KeuanganPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Keuangan</h2>
          <p className="text-muted mb-0">Modul pencatatan transaksi kas masuk, kas keluar, dan persembahan.</p>
        </div>
      </div>
      <KeuanganList data={[]} />
    </div>
  );
}
