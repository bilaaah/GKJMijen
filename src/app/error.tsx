'use client';

import { useEffect } from 'react';
import { Button } from '@/components/common';
import { Alert } from '@/components/feedback';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="boot">
      <div style={{ maxWidth: 440 }} className="px-3">
        <Alert tone="bad">
          <b>Terjadi kesalahan.</b> Halaman tidak dapat ditampilkan. Coba muat ulang, dan jika masih gagal hubungi tim pengembang.
        </Alert>
        <div className="text-center mt-3">
          <Button onClick={() => reset()} icon="arrow-repeat">
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
