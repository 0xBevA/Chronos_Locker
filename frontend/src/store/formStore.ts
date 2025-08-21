import { create } from 'zustand';

type Plan = {
  recipient: string;
  amount: string;
  startDate: string;
};

type FormState = {
  step: number;
  tokenAddress: string;
  unlockFrequency: 'Linear' | 'Periodic' | 'Single';
  vestingTerm: number;
  vestingTermUnit: 'years' | 'months' | 'days';
  cliff: number;
  cliffUnit: 'years' | 'months' | 'days';
  postVestingLockup: boolean;
  vestingAdmin: string;
  plans: Plan[];
  isApproved: boolean;

  setStep: (step: number) => void;
  setTokenAddress: (address: string) => void;
  setUnlockFrequency: (freq: 'Linear' | 'Periodic' | 'Single') => void;
  setVestingTerm: (term: number) => void;
  setVestingTermUnit: (unit: 'years' | 'months' | 'days') => void;
  setCliff: (cliff: number) => void;
  setCliffUnit: (unit: 'years' | 'months' | 'days') => void;
  setPostVestingLockup: (value: boolean) => void;
  setVestingAdmin: (admin: string) => void;
  addPlan: () => void;
  removePlan: (index: number) => void;
  updatePlan: (index: number, field: keyof Plan, value: string) => void;
  setIsApproved: (isApproved: boolean) => void;
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
  vestingAdmin: '',
  plans: [{ recipient: '', amount: '', startDate: '' }],
  isApproved: false,

  setStep: (step) => set({ step }),
  setTokenAddress: (address) => set({ tokenAddress: address }),
  setUnlockFrequency: (freq) => set({ unlockFrequency: freq }),
  setVestingTerm: (term) => set({ vestingTerm: term }),
  setVestingTermUnit: (unit) => set({ vestingTermUnit: unit }),
  setCliff: (cliff) => set({ cliff: cliff }),
  setCliffUnit: (unit) => set({ cliffUnit: unit }),
  setPostVestingLockup: (value) => set({ postVestingLockup: value }),
  setVestingAdmin: (admin) => set({ vestingAdmin: admin }),
  addPlan: () =>
    set((state) => ({
      plans: [...state.plans, { recipient: '', amount: '', startDate: '' }],
    })),
  removePlan: (index) =>
    set((state) => ({
      plans: state.plans.filter((_, i) => i !== index),
    })),
  updatePlan: (index, field, value) =>
    set((state) => ({
      plans: state.plans.map((plan, i) => (i === index ? { ...plan, [field]: value } : plan)),
    })),
  setIsApproved: (isApproved) => set({ isApproved }),
}));
