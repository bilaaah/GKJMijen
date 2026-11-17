'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logging error ke reporting service jika diperlukan
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="container py-5 text-center">
      <div className="alert alert-danger p-4">
        <h4 className="alert-heading">Terjadi Kesalahan Sistem</h4>
        <p className="text-muted">Maaf, terjadi kendala saat memproses permintaan Anda.</p>
        <button className="btn btn-danger mt-2" onClick={() => reset()}>
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
