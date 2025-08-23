import { useWriteContract, useAccount } from 'wagmi';
import { isAddress, parseEther } from 'viem';
import { TokenVestingPlansABI } from '@/abi/TokenVestingPlans';
import { useFormStore } from '@/store/formStore';

const contractAddress = '0xB60945f33FaC45e8D44b11f54d7c4CE90dc15996'; // From deployed-contracts.txt

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
  const {
    tokenAddress,
    vestingTerm,
    vestingTermUnit,
    cliff,
    cliffUnit,
    vestingAdmin: admin,
    plans,
    postVestingLockup,
  } = useFormStore();
  const { data, isPending, isSuccess, writeContractAsync } = useWriteContract();

  const createPlan = async () => {
    if (!writeContractAsync) return;

    for (const plan of plans) {
      const { recipient, amount, startDate } = plan;
      if (!isAddress(recipient) || !amount || !startDate) {
        console.error('Invalid plan:', plan);
        continue; // Skip invalid plans
      }

      const parsedAmount = parseEther(amount);
      const vestingAdmin = admin || connectedAddress || '0x0000000000000000000000000000000000000000';
      const start = BigInt(Math.floor(new Date(startDate).getTime() / 1000));
      const cliffSeconds = BigInt(getSeconds(cliff, cliffUnit));
      const cliffDate = start + cliffSeconds;
      const vestingSeconds = BigInt(getSeconds(vestingTerm, vestingTermUnit));
      const period = 1n; // Linear vesting means rate is per second
      const rate = vestingSeconds > 0n ? parsedAmount / vestingSeconds : 0n;

      try {
        await writeContractAsync({
          address: contractAddress,
          abi: TokenVestingPlansABI,
          functionName: 'createPlan',
          args: [recipient as `0x${string}`, tokenAddress as `0x${string}`, parsedAmount, start, cliffDate, rate, period, vestingAdmin as `0x${string}`, postVestingLockup],
        });
      } catch (error) {
        console.error('Failed to create plan:', error);
      }
    }
  };

  return { data, isLoading: isPending, isSuccess, createPlan };
}
