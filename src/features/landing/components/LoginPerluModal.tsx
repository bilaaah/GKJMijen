'use client';

import React from 'react';
import Link from 'next/link';
import { Icon, Modal } from '@/components/common';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Popup "Login diperlukan" saat pengunjung menekan Layanan Surat.
 * Tombol Login membawa ke halaman login (dibuat tim auth) dengan ?next=
 * supaya setelah login warga langsung masuk ke formulir pengajuan surat.
 */
export const LoginPerluModal: React.FC<{ isOpen: boolean; onClose: () => void; tujuan?: string }> = ({ isOpen, onClose, tujuan = ROUTES.PORTAL.AJUKAN }) => (
  <Modal isOpen={isOpen} onClose={onClose} centered>
    <div className="lp-lock" aria-hidden="true">
      <Icon name="lock-fill" />
    </div>
    <h3>Login diperlukan</h3>
    <p className="muted" style={{ margin: '0 auto', maxWidth: '34ch' }}>
      Silakan login terlebih dahulu untuk mengajukan dan memantau surat gerejawi.
    </p>
    <div className="lp-lock-acts">
      <Link href={`${ROUTES.AUTH.LOGIN}?next=${encodeURIComponent(tujuan)}`} className="btn btn-primary w-100">
        <Icon name="box-arrow-in-right" /> Login
      </Link>
      <button type="button" className="btn btn-outline-primary w-100" onClick={onClose}>
        Batal
      </button>
    </div>
    <p className="lp-lock-foot">
      Belum punya akun?{' '}
      <Link href={ROUTES.AUTH.REGISTER} className="link">
        Daftar sebagai warga
      </Link>
    </p>
  </Modal>
);
