export interface ToastProps {
  text?: string | object;
  position?: 'top' | 'top-center' | 'top-left' | 'top-right' | 'bottom' | 'bottom-center' | 'bottom-left' | 'bottom-right';
  duration?: 'normal' | 'long' | 'short' | number;
  type?: 'normal' | 'success' | 'danger' | 'info' | 'warning';
}