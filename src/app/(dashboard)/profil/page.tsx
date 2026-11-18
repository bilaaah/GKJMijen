import type { Metadata } from 'next';
import { ProfilForm } from '@/features/akun/components';

export const metadata: Metadata = { title: 'Profil Saya' };

export default function ProfilPage() {
  return <ProfilForm />;
}
