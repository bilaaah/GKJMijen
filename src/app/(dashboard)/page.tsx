import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard SIM GKJ Mijen</h2>
        <p className="text-muted">Selamat datang di Sistem Informasi Manajemen GKJ Mijen.</p>
      </div>

      <div className="row g-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="text-muted mb-2">Data Jemaat</h6>
            <h4 className="fw-bold mb-3">Modul 1</h4>
            <Link href="/jemaat" className="btn btn-outline-primary btn-sm">Buka Data Jemaat</Link>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="text-muted mb-2">Layanan Surat</h6>
            <h4 className="fw-bold mb-3">Modul 2</h4>
            <Link href="/surat" className="btn btn-outline-primary btn-sm">Buka Layanan Surat</Link>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="text-muted mb-2">Keuangan</h6>
            <h4 className="fw-bold mb-3">Modul 3</h4>
            <Link href="/keuangan" className="btn btn-outline-primary btn-sm">Buka Keuangan</Link>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="text-muted mb-2">Jadwal & Warta</h6>
            <h4 className="fw-bold mb-3">Modul 4</h4>
            <Link href="/jadwal-warta" className="btn btn-outline-primary btn-sm">Buka Jadwal & Warta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
