import { create } from 'zustand';

export type ZoneType = 'about' | 'skills' | 'projects' | 'experience' | 'contact' | null;

interface GameState {
  isLoading: boolean;
  loadingProgress: number;
  showInstructions: boolean;
  activeZone: ZoneType;
  isMuted: boolean;
  isMobile: boolean;
  carSpeed: number;
  
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setShowInstructions: (show: boolean) => void;
  setActiveZone: (zone: ZoneType) => void;
  toggleMute: () => void;
  setIsMobile: (mobile: boolean) => void;
  setCarSpeed: (speed: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  isLoading: true,
  loadingProgress: 0,
  showInstructions: true,
  activeZone: null,
  isMuted: true,
  isMobile: false,
  carSpeed: 0,
  
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setShowInstructions: (show) => set({ showInstructions: show }),
  setActiveZone: (zone) => set({ activeZone: zone }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  setCarSpeed: (speed) => set({ carSpeed: speed }),
}));
