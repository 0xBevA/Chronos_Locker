import { create } from 'zustand';

type FormState = {
  step: number;
  tokenAddress: string;
  unlockFrequency: 'Linear' | 'Periodic' | 'Single';
  vestingTerm: number;
  vestingTermUnit: 'years' | 'months' | 'days';
  cliff: number;
  cliffUnit: 'years' | 'months' | 'days';
  postVestingLockup: boolean;

  setStep: (step: number) => void;
  setTokenAddress: (address: string) => void;
  // ... other setters will be added here
};

export const useFormStore = create<FormState>((set) => ({
  step: 1,
  tokenAddress: '',
  unlockFrequency: 'Linear',
  vestingTerm: 3,
  vestingTermUnit: 'years',
  cliff: 1,
  cliffUnit: 'years',
  postVestingLockup: false,

  setStep: (step) => set({ step }),
  setTokenAddress: (address) => set({ tokenAddress: address }),
}));
