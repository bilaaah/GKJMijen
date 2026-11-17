import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1 fw-bold text-secondary">404</h1>
      <h3 className="mb-3">Halaman Tidak Ditemukan</h3>
      <p className="text-muted mb-4">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link href="/" className="btn btn-primary">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
