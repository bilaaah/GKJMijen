import { UserListTable } from '@/features/pengguna-akses';

export default function PenggunaAksesIndexPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Pengguna & Hak Akses</h2>
      <p className="text-muted">Administrasi akun pengguna, penetapan peran (RBAC), dan audit trail.</p>
      <UserListTable profiles={[]} />
    </div>
  );
}
