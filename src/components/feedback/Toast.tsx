'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { Icon } from '../common/Icon';

type ToastTone = 'ok' | 'info' | 'bad';
interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

/** Notifikasi kecil di pojok kanan bawah, hilang sendiri setelah ~4 detik. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = 'ok') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="gk-toast-root" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`gk-toast ${t.tone}`}>
            <Icon name={t.tone === 'ok' ? 'check-circle-fill' : t.tone === 'bad' ? 'exclamation-circle-fill' : 'info-circle-fill'} />
            <div>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
