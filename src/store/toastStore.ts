import { create } from 'zustand';
import { ToastProps } from '@/components/ui/Toast';

interface ToastState {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: get().removeToast,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Helper functions for easy toast creation
export const toast = {
  success: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: 'success', title, message });
  },
  error: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: 'error', title, message });
  },
  info: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: 'info', title, message });
  },
  warning: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: 'warning', title, message });
  },
};