'use client';

import { useToastStore } from '@/store/toastStore';
import { ToastContainer } from '@/components/ui/Toast';

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return <ToastContainer toasts={toasts} onClose={removeToast} />;
}