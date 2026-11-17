import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata: Metadata = {
  title: 'SIM GKJ Mijen - Sistem Informasi Manajemen Gereja',
  description: 'Aplikasi manajemen administrasi, jemaat, keuangan, dan peribadatan GKJ Mijen.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
