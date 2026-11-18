import type { Metadata } from 'next';
import { AkunList } from '@/features/akun/components';

export const metadata: Metadata = { title: 'Akun Pengguna' };

export default function AkunPage() {
  return <AkunList />;
}
