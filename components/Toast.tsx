'use client';

import { useEffect, useRef, useState } from 'react';
import { useUiStore } from '@/stores/ui-store';

export function Toast() {
  const toast = useUiStore(s => s.toast);
  const [show, setShow] = useState(false);
  const last = useRef(toast);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  if (toast) last.current = toast; // keep the text while the toast fades out

  useEffect(() => {
    if (!toast) return;
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), toast.action ? 4500 : 2200);
    return () => clearTimeout(timer.current);
  }, [toast]);

  const t = last.current;
  return (
    <div className={`toast${show ? ' show' : ''}${t?.action ? ' has-act' : ''}`} role="status" aria-live="polite">
      {t?.msg}
      {t?.action && (
        <>
          {' '}
          <button
            className="toast-act"
            onClick={() => {
              t.action!.fn();
              setShow(false);
            }}
          >
            {t.action.label}
          </button>
        </>
      )}
    </div>
  );
}
