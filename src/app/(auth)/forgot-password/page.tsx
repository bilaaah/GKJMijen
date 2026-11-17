import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div>
      <h5 className="card-title text-center mb-3">Atur Ulang Kata Sandi</h5>
      <p className="text-muted small text-center mb-4">
        Masukkan email terdaftar untuk menerima tautan pemulihan kata sandi.
      </p>
      {/* Scaffolding Form Placeholder */}
      <form>
        <div className="mb-3">
          <label className="form-label">Email Terdaftar</label>
          <input type="email" className="form-control" placeholder="nama@email.com" disabled />
        </div>
        <button type="button" className="btn btn-primary w-100 mb-3" disabled>
          Kirim Tautan Pemulihan
        </button>
      </form>
      <div className="text-center small">
        <Link href="/login">Kembali ke halaman login</Link>
      </div>
    </div>
  );
}
