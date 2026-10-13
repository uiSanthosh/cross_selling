import { create } from 'zustand';

export interface ToastAction {
  label: string;
  fn: () => void;
}

interface UiState {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
  toast: { id: number; msg: string; action?: ToastAction } | null;
  showToast: (msg: string, action?: ToastAction) => void;
  hideToast: () => void;
}

let toastId = 0;

export const useUiStore = create<UiState>(set => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  setCartOpen: cartOpen => set({ cartOpen }),
  toast: null,
  showToast: (msg, action) => set({ toast: { id: ++toastId, msg, action } }),
  hideToast: () => set({ toast: null }),
}));
