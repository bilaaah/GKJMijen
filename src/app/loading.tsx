export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Memuat halaman...</span>
      </div>
    </div>
  );
}
