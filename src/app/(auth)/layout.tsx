export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="w-100" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">SIM GKJ Mijen</h3>
          <p className="text-muted small">Sistem Informasi Manajemen Gereja</p>
        </div>
        <div className="card shadow-sm border-0 p-4">{children}</div>
      </div>
    </div>
  );
}
