import { useReadContract, useAccount } from 'wagmi';
import { ERC20ABI } from '@/abi/ERC20';
import { isAddress } from 'viem';

const vestingContractAddress = '0xB60945f33FaC45e8D44b11f54d7c4CE90dc15996';

export function useAllowance(tokenAddress: `0x${string}`) {
  const { address: ownerAddress } = useAccount();

  const { data: allowance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: [ownerAddress!, vestingContractAddress],
    query: {
      enabled: isAddress(tokenAddress) && !!ownerAddress,
    },
  });

  return { allowance, isLoading, refetch };
}