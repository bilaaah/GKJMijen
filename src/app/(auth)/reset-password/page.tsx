'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common';
import { PasswordInput } from '@/components/forms';
import { useToast } from '@/components/feedback';
import { ROUTES } from '@/lib/constants/routes';

export default function ResetPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [errors, setErrors] = useState<{ pw?: string; pw2?: string }>({});

  return (
    <>
      <div className="eyebrow">Kata sandi baru</div>
      <h1>Buat Kata Sandi Baru</h1>
      <p className="muted">Kata sandi baru akan menggantikan kata sandi lama Anda.</p>
      <form
        className="form-stack"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const er: typeof errors = {};
          if (pw.length < 8) er.pw = 'Kata sandi minimal 8 karakter.';
          if (pw2 !== pw) er.pw2 = 'Konfirmasi kata sandi tidak cocok.';
          setErrors(er);
          if (Object.keys(er).length) return;
          toast('Kata sandi diperbarui. Silakan masuk dengan kata sandi baru.');
          router.push(ROUTES.AUTH.LOGIN);
        }}
      >
        <PasswordInput id="password" label="Kata Sandi Baru" required placeholder="Minimal 8 karakter" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} error={errors.pw} />
        <PasswordInput id="password2" label="Konfirmasi Kata Sandi Baru" required placeholder="Ulangi kata sandi baru" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} error={errors.pw2} />
        <Button type="submit" block>
          Simpan Kata Sandi
        </Button>
      </form>
    </>
  );
}
