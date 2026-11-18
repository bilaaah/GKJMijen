import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';

export default function Loading() {
  return (
    <div className="boot">
      <LoadingSpinner label="Memuat halaman…" />
    </div>
  );
}
