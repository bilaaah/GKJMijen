import type { Metadata } from 'next';
import { ProfilWarga } from '@/features/portal';

export const metadata: Metadata = { title: 'Profil Saya' };

export default function ProfilWargaPage() {
  return <ProfilWarga />;
}
