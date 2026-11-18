import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Beranda sementara mengarah ke halaman login.
 * TODO [Frontend]: ganti dengan landing page publik (jadwal & warta terbit).
 */
export default function HomePage() {
  redirect(ROUTES.AUTH.LOGIN);
}
