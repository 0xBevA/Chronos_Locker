import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { utils } from 'ethers';
import { ERC20ABI } from '@/abi/ERC20';
import { useFormStore } from '@/store/formStore';

const contractAddress = '0xB60945f33FaC45e8D44b11f54d7c4CE90dc15996'; // The vesting contract is the spender

export function useApprove() {
  const { tokenAddress, plans } = useFormStore();

  const totalAmount = plans.reduce((acc, plan) => {
    if (plan.amount) {
      return acc.add(utils.parseEther(plan.amount));
    }
    return acc;
  }, utils.parseEther('0'));

  const { config } = usePrepareContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: 'approve',
    args: [contractAddress, totalAmount],
    enabled: utils.isAddress(tokenAddress) && totalAmount.gt(0),
  });

  const { data, isLoading, isSuccess, write: approve } = useContractWrite(config);

  return { data, isLoading, isSuccess, approve };
}
