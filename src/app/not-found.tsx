import { ButtonLink, LogoMark } from '@/components/common';

export default function NotFound() {
  return (
    <div className="boot">
      <div className="text-center px-3">
        <div className="d-flex justify-content-center mb-3">
          <LogoMark tone="maroon" size="xl" />
        </div>
        <div className="eyebrow justify-content-center">Halaman tidak ditemukan</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 64, margin: '8px 0', color: 'var(--maroon)' }}>404</h1>
        <p className="muted mb-4">Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.</p>
        <ButtonLink href="/dashboard">Kembali ke Dashboard</ButtonLink>
      </div>
    </div>
  );
}
