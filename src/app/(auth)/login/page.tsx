import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      <h5 className="card-title text-center mb-3">Masuk ke Akun</h5>
      <p className="text-muted small text-center mb-4">
        Silakan masukkan email dan kata sandi Anda.
      </p>
      {/* Scaffolding Form Placeholder */}
      <form>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="nama@email.com" disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Kata Sandi</label>
          <input type="password" className="form-control" placeholder="••••••••" disabled />
        </div>
        <button type="button" className="btn btn-primary w-100 mb-3" disabled>
          Masuk
        </button>
      </form>
      <div className="text-center small">
        <Link href="/forgot-password">Lupa kata sandi?</Link>
      </div>
    </div>
  );
}
