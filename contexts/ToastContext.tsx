import React from 'react';

// Define ToastType and ToastMessage here as they are integral to the context
export type ToastType = 'success' | 'info' | 'alert';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export const ToastContext = React.createContext<{
  addToast: (message: string, type?: ToastType) => void;
}>({
  addToast: () => {},
});
