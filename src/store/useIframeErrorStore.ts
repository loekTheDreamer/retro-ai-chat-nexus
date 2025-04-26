import { create } from 'zustand';

export type IFrameErrorStore = {
  iframeError: { msg: string; url: string; line: number; col: number } | null;
  hasIframeError: boolean;
  handlingIframeError: boolean;
  setIframeError: (iframeError: {
    msg: string;
    url: string;
    line: number;
    col: number;
  }) => void;
  setHandlingIframeError: () => void;
  resetIframeError: () => void;
};

export const useIframeErrorStore = create<IFrameErrorStore>((set) => ({
  iframeError: null,
  hasIframeError: false,
  handlingIframeError: false,
  setIframeError: (iframeError) => set({ iframeError, hasIframeError: true }),
  setHandlingIframeError: () => set({ handlingIframeError: true }),
  resetIframeError: () =>
    set({
      iframeError: null,
      hasIframeError: false,
      handlingIframeError: false
    })
}));
