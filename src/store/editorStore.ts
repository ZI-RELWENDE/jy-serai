import { create } from "zustand";
import { EditorState } from "@/types";

interface EditorStore extends EditorState {
  setFrame: (url: string) => void;
  setPhoto: (url: string) => void;
  setScale: (v: number) => void;
  setPosX: (v: number) => void;
  setPosY: (v: number) => void;
  setRotation: (v: number) => void;
  setBrightness: (v: number) => void;
  setContrast: (v: number) => void;
  setCircleCrop: (v: boolean) => void;
  setFlipH: (v: boolean) => void;
  setFlipV: (v: boolean) => void;
  setTextOverlay: (v: string) => void;
  setTextColor: (v: string) => void;
  setTextSize: (v: number) => void;
  reset: () => void;
}

const defaults: EditorState = {
  frameUrl: null,
  photoUrl: null,
  scale: 100,
  posX: 0,
  posY: 0,
  rotation: 0,
  brightness: 100,
  contrast: 100,
  isCircleCrop: false,
  flipH: false,
  flipV: false,
  textOverlay: "",
  textColor: "#ffffff",
  textSize: 32,
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...defaults,
  setFrame: (url) => set({ frameUrl: url }),
  setPhoto: (url) => set({ photoUrl: url }),
  setScale: (v) => set({ scale: v }),
  setPosX: (v) => set({ posX: v }),
  setPosY: (v) => set({ posY: v }),
  setRotation: (v) => set({ rotation: v }),
  setBrightness: (v) => set({ brightness: v }),
  setContrast: (v) => set({ contrast: v }),
  setCircleCrop: (v) => set({ isCircleCrop: v }),
  setFlipH: (v) => set({ flipH: v }),
  setFlipV: (v) => set({ flipV: v }),
  setTextOverlay: (v) => set({ textOverlay: v }),
  setTextColor: (v) => set({ textColor: v }),
  setTextSize: (v) => set({ textSize: v }),
  reset: () => set(defaults),
}));
