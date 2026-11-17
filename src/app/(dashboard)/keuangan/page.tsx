import { TransaksiTable } from '@/features/keuangan';

export default function KeuanganIndexPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Keuangan Gereja</h2>
      <p className="text-muted">Ikhtisar transaksi penerimaan, pengeluaran, dan persembahan GKJ Mijen.</p>
      <TransaksiTable data={[]} />
    </div>
  );
}
