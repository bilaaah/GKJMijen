import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container py-5 text-center">
      <div className="p-5 mb-4 bg-light rounded-3 border">
        <h1 className="display-5 fw-bold text-primary">SIM GKJ Mijen</h1>
        <p className="fs-5 text-muted">
          Sistem Informasi Manajemen Gereja Kristen Jawa Mijen
        </p>
        <p className="small text-secondary mb-4">
          Fondasi arsitektur modular Next.js & Supabase.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link href="/login" className="btn btn-primary btn-lg">
            Masuk ke Sistem
          </Link>
          <Link href="/jemaat" className="btn btn-outline-secondary btn-lg">
            Dashboard Utama
          </Link>
        </div>
      </div>
    </main>
  );
}
