'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface ConfirmOptions {
  title: string;
  message: React.ReactNode;
  extra?: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
}

const ConfirmContext = createContext<(opts: ConfirmOptions) => void>(() => {});

/** Dialog konfirmasi hapus yang bisa dipanggil dari mana saja lewat useConfirm(). */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const close = useCallback(() => setOpts(null), []);

  return (
    <ConfirmContext.Provider value={setOpts}>
      {children}
      <Modal
        isOpen={!!opts}
        onClose={close}
        centered
        footer={
          <>
            <Button variant="outline" onClick={close}>
              Batal
            </Button>
            <Button
              variant="danger"
              icon="trash3"
              onClick={() => {
                opts?.onConfirm();
                close();
              }}
            >
              {opts?.confirmLabel ?? 'Ya, Hapus'}
            </Button>
          </>
        }
      >
        <div className="ic-circle bad">
          <Icon name="trash3" />
        </div>
        <h3>{opts?.title}</h3>
        <p className="muted" style={{ margin: 0 }}>
          {opts?.message}
        </p>
        {opts?.extra && <div style={{ marginTop: 14, textAlign: 'left' }}>{opts.extra}</div>}
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
