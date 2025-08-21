import { useContractWrite } from 'wagmi';
import { utils } from 'ethers';
import { TokenVestingPlansABI } from '@/abi/TokenVestingPlans';

const contractAddress = '0xB60945f33FaC45e8D44b11f54d7c4CE90dc15996'; // From deployed-contracts.txt

import { useFormStore } from '@/store/formStore';
import { useAccount } from 'wagmi';

// Helper function to convert time units to seconds
const getSeconds = (amount: number, unit: 'days' | 'months' | 'years') => {
  switch (unit) {
    case 'days':
      return amount * 86400;
    case 'months':
      return amount * 2592000; // 30 days
    case 'years':
      return amount * 31536000;
    default:
      return 0;
  }
};

export function useCreatePlan() {
  const { address: connectedAddress } = useAccount();
  const { tokenAddress, vestingTerm, vestingTermUnit, cliff, cliffUnit, vestingAdmin: admin, plans } = useFormStore();

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: contractAddress,
    abi: TokenVestingPlansABI,
    functionName: 'createPlan',
  });

  const createPlan = async () => {
    if (!writeAsync) return;

    for (const plan of plans) {
      const { recipient, amount, startDate } = plan;
      if (!utils.isAddress(recipient) || !amount || !startDate) {
        console.error('Invalid plan:', plan);
        continue; // Skip invalid plans
      }

      const parsedAmount = utils.parseEther(amount);
      const vestingAdmin = admin || connectedAddress || '0x0000000000000000000000000000000000000000';
      const start = Math.floor(new Date(startDate).getTime() / 1000);
      const cliffSeconds = getSeconds(cliff, cliffUnit);
      const cliffDate = start + cliffSeconds;
      const vestingSeconds = getSeconds(vestingTerm, vestingTermUnit);
      const period = 1; // Linear vesting means rate is per second
      const rate = vestingSeconds > 0 ? parsedAmount.div(vestingSeconds) : utils.parseEther('0');

      try {
        await writeAsync({
          args: [recipient, tokenAddress, parsedAmount, start, cliffDate, rate, period, vestingAdmin, false],
        });
      } catch (error) {
        console.error('Failed to create plan:', error);
      }
    }
  };

  return { data, isLoading, isSuccess, createPlan };
}
