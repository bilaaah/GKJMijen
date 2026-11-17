import React from 'react';
import type { Profile } from '../types';

export interface UserListTableProps {
  profiles: Profile[];
}

export const UserListTable: React.FC<UserListTableProps> = ({ profiles }) => {
  return (
    <div className="border rounded p-3 text-center text-muted">
      <h6>Komponen UserListTable (Scaffolding)</h6>
      <p>Total pengguna terdaftar: {profiles?.length || 0}</p>
    </div>
  );
};
