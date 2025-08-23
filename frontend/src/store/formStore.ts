import { create } from 'zustand';
import { isAddress } from 'viem';

type Plan = {
  recipient: string;
  amount: string;
  startDate: string;
  isRecipientValid: boolean;
  hasSufficientBalance: boolean;
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
  isValidAddress: boolean;
  isAdminAddressValid: boolean;

  setStep: (step: number) => void;
  setTokenAddress: (address: string) => void;
  setIsValidAddress: (isValid: boolean) => void;
  setIsAdminAddressValid: (isValid: boolean) => void;
  setUnlockFrequency: (freq: 'Linear' | 'Periodic' | 'Single') => void;
  setVestingTerm: (term: number) => void;
  setVestingTermUnit: (unit: 'years' | 'months' | 'days') => void;
  setCliff: (cliff: number) => void;
  setCliffUnit: (unit: 'years' | 'months' | 'days') => void;
  setPostVestingLockup: (value: boolean) => void;
  setVestingAdmin: (admin: string) => void;
  addPlan: () => void;
  removePlan: (index: number) => void;
  updatePlan: (
    index: number,
    field: keyof Omit<Plan, 'isRecipientValid' | 'hasSufficientBalance'>,
    value: string
  ) => void;
  setIsApproved: (isApproved: boolean) => void;
  setPlanBalanceValidity: (index: number, isValid: boolean) => void;
  resetForm: () => void;
};

const initialState: Omit<
  FormState,
  | 'setStep'
  | 'setTokenAddress'
  | 'setIsValidAddress'
  | 'setIsAdminAddressValid'
  | 'setUnlockFrequency'
  | 'setVestingTerm'
  | 'setVestingTermUnit'
  | 'setCliff'
  | 'setCliffUnit'
  | 'setPostVestingLockup'
  | 'setVestingAdmin'
  | 'addPlan'
  | 'removePlan'
  | 'updatePlan'
  | 'setIsApproved'
  | 'setPlanBalanceValidity'
  | 'resetForm'
> = {
  step: 1,
  tokenAddress: '',
  unlockFrequency: 'Linear',
  vestingTerm: 3,
  vestingTermUnit: 'years',
  cliff: 1,
  cliffUnit: 'years',
  postVestingLockup: false,
  vestingAdmin: '',
  plans: [{ recipient: '', amount: '', startDate: '', isRecipientValid: true, hasSufficientBalance: true }],
  isApproved: false,
  isValidAddress: true,
  isAdminAddressValid: true,
};

export const useFormStore = create<FormState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setTokenAddress: (address) => set({ tokenAddress: address }),
  setIsValidAddress: (isValid) => set({ isValidAddress: isValid }),
  setIsAdminAddressValid: (isValid) => set({ isAdminAddressValid: isValid }),
  setUnlockFrequency: (freq) => set({ unlockFrequency: freq }),
  setVestingTerm: (term) => set({ vestingTerm: term }),
  setVestingTermUnit: (unit) => set({ vestingTermUnit: unit }),
  setCliff: (cliff) => set({ cliff: cliff }),
  setCliffUnit: (unit) => set({ cliffUnit: unit }),
  setPostVestingLockup: (value) => set({ postVestingLockup: value }),
  setVestingAdmin: (admin) => set({ vestingAdmin: admin }),
  addPlan: () =>
    set((state) => ({
      plans: [
        ...state.plans,
        { recipient: '', amount: '', startDate: '', isRecipientValid: true, hasSufficientBalance: true },
      ],
    })),
  removePlan: (index) =>
    set((state) => ({
      plans: state.plans.filter((_, i) => i !== index),
    })),
  updatePlan: (index, field, value) =>
    set((state) => {
      const newPlans = state.plans.map((plan, i) => {
        if (i === index) {
          const updatedPlan = { ...plan, [field]: value };
          if (field === 'recipient') {
            updatedPlan.isRecipientValid = isAddress(value);
          }
          return updatedPlan;
        }
        return plan;
      });
      return { plans: newPlans };
    }),
  setIsApproved: (isApproved) => set({ isApproved }),
  setPlanBalanceValidity: (index: number, isValid: boolean) =>
    set((state) => ({
      plans: state.plans.map((plan, i) =>
        i === index ? { ...plan, hasSufficientBalance: isValid } : plan
      ),
    })),
  resetForm: () => set(initialState),
}));
