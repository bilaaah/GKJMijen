import type { Metadata } from 'next';
import { PortalShell } from '@/features/portal';
import '@/styles/jemaat.css';

export const metadata: Metadata = { title: { default: 'Portal Jemaat', template: '%s · Portal Jemaat GKJ Mijen' } };

/** Semua halaman /portal memakai kerangka portal (navbar + cek login warga). */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
