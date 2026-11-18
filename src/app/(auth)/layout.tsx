import Image from 'next/image';
import { Logo } from '@/components/common/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth">
      <aside className="auth-art">
        <Logo href="/login" />
        <div className="auth-stage">
          <div className="arch-wrap">
            <div className="arch">
              <Image src="/images/foto-gkj-mijen.jpeg" alt="Gedung GKJ Mijen Semarang dengan salib merah di fasad" fill sizes="270px" priority />
            </div>
          </div>
          <div className="auth-copy">
            <div className="eyebrow eb-light">Portal Pelayanan Jemaat</div>
            <h2>Satu keluarga dalam kasih Kristus</h2>
            <p>Kelola data jemaat, layanan surat, keuangan, jadwal, dan warta GKJ Mijen dalam satu tempat.</p>
          </div>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">{children}</div>
        <p className="auth-foot">© {new Date().getFullYear()} GKJ Mijen Semarang</p>
      </main>
    </div>
  );
}
