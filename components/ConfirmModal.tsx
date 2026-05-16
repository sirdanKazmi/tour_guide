'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'delete' | 'confirm' | 'warning';
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'delete',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'delete':
        return {
          icon: '🗑️',
          iconBg: 'bg-red-500/10',
          iconBorder: 'border-red-500/20',
          confirmBg: 'bg-red-500 hover:bg-red-600',
          confirmShadow: 'shadow-red-500/25',
        };
      case 'confirm':
        return {
          icon: '✅',
          iconBg: 'bg-green-500/10',
          iconBorder: 'border-green-500/20',
          confirmBg: 'bg-green-500 hover:bg-green-600',
          confirmShadow: 'shadow-green-500/25',
        };
      case 'warning':
        return {
          icon: '⚠️',
          iconBg: 'bg-yellow-500/10',
          iconBorder: 'border-yellow-500/20',
          confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
          confirmShadow: 'shadow-yellow-500/25',
        };
      default:
        return {
          icon: '️',
          iconBg: 'bg-red-500/10',
          iconBorder: 'border-red-500/20',
          confirmBg: 'bg-red-500 hover:bg-red-600',
          confirmShadow: 'shadow-red-500/25',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6">
              {/* Icon */}
              <div className={`w-16 h-16 ${styles.iconBg} ${styles.iconBorder} border rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-3xl">{styles.icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {title}
              </h3>

              {/* Message */}
              <p className="text-gray-400 text-center mb-6">
                {message}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all font-medium"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-3 ${styles.confirmBg} text-white rounded-xl font-medium shadow-lg ${styles.confirmShadow} transition-all`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
