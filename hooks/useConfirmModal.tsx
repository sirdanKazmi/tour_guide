'use client';

import { useState, useCallback, useMemo } from 'react';
import ConfirmModal from '@/components/ConfirmModal';

interface ConfirmOptions {
  title: string;
  message: string;
  type?: 'delete' | 'confirm' | 'warning';
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    message: '',
    type: 'delete',
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const show = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
  }, [resolver]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
  }, [resolver]);

  const ConfirmModalComponent = useMemo(
    () => {
      const Component = () => (
        <ConfirmModal
          isOpen={isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={options.title}
          message={options.message}
          type={options.type}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
        />
      );
      Component.displayName = 'ConfirmModalComponent';
      return Component;
    },
    [isOpen, options, handleConfirm, handleClose]
  ) as React.FC;

  return { show, ConfirmModalComponent };
}
