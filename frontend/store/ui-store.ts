import { create } from 'zustand';

type UiState = {
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  selectedMatchId: string;
  setSelectedMatchId: (id: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  onboardingStep: 1,
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  selectedMatchId: '',
  setSelectedMatchId: (id) => set({ selectedMatchId: id }),
}));
