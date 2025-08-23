import { useSimulateContract, useWriteContract } from 'wagmi';
import { isAddress, parseEther } from 'viem';
import { ERC20ABI } from '@/abi/ERC20';
import { useFormStore } from '@/store/formStore';

const contractAddress = '0xB60945f33FaC45e8D44b11f54d7c4CE90dc15996'; // The vesting contract is the spender

export function useApprove() {
  const { tokenAddress, plans } = useFormStore();

  const totalAmount = plans.reduce((acc: bigint, plan: { amount: string }) => {
    if (plan.amount) {
      try {
        return acc + parseEther(plan.amount);
      } catch {
        return acc;
      }
    }
    return acc;
  }, 0n);

  const { data: simulationData } = useSimulateContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: 'approve',
    args: [contractAddress, totalAmount],
    query: {
      enabled: isAddress(tokenAddress) && totalAmount > 0n,
    },
  });

  const { data, isPending, isSuccess, writeContract } = useWriteContract();

  const approve = () => {
    if (simulationData?.request) {
      writeContract(simulationData.request);
    }
  };

  return { data, isLoading: isPending, isSuccess, approve };
}
