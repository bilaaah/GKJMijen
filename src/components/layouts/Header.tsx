import React from 'react';
import Link from 'next/link';

export interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Pengguna',
  userRole = 'Warga',
}) => {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">
      <Link href="/" className="navbar-brand fw-bold">
        SIM GKJ Mijen
      </Link>
      <div className="ms-auto d-flex align-items-center">
        <span className="text-light me-3 small">
          {userName} ({userRole})
        </span>
        <button className="btn btn-outline-light btn-sm" type="button">
          Keluar
        </button>
      </div>
    </header>
  );
};
