import { useAccount, useReadContract } from 'wagmi';
import { TokenVestingPlansABI } from '@/abi/TokenVestingPlans';
import { ERC20ABI } from '@/abi/ERC20';
import { useEffect, useState, useMemo } from 'react';
import { formatEther, parseEther } from 'viem';
import { readContract } from '@wagmi/core';
import { config } from '@/config';

const contractAddress = '0xB60945f33FaC45e8D44b11f54d7c4CE90dc15996' as const;

export interface TokenInfo {
  name: string;
  symbol: string;
  address: `0x${string}`;
}

export interface DashboardPlan {
  token: TokenInfo;
  granted: string;
  vested: string;
  activePlans: number;
}

export function useVestingPlans() {
  const { address, isConnected } = useAccount();
  const [plans, setPlans] = useState<DashboardPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const balanceOfArgs = useMemo(() => {
    if (!address) return undefined;
    return [address] as const;
  }, [address]);

  const { data: balanceResult, isFetching: isFetchingBalance } = useReadContract({
    address: contractAddress,
    abi: TokenVestingPlansABI,
    functionName: 'balanceOf',
    args: balanceOfArgs,
    query: {
      enabled: isConnected && !!address,
    },
  });

  useEffect(() => {
    const fetchPlans = async () => {
      if (!isConnected || !address || balanceResult === undefined || balanceResult === null) {
        setIsLoading(false);
        return;
      }

      const balance = BigInt(balanceResult.toString());
      if (balance === 0n) {
        setPlans([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const groupedPlans: { [key: string]: DashboardPlan } = {};

      for (let i = 0; i < Number(balance); i++) {
        try {
          const planId = await readContract(config, {
            address: contractAddress,
            abi: TokenVestingPlansABI,
            functionName: 'tokenOfOwnerByIndex',
            args: [address, BigInt(i)],
          });

          const planDetails = await readContract(config, {
            address: contractAddress,
            abi: TokenVestingPlansABI,
            functionName: 'plans',
            args: [planId],
          });

          const [tokenAddress, grantedAmount] = planDetails as unknown as [`0x${string}`, bigint];

          const vestedResult = await readContract(config, {
              address: contractAddress,
              abi: TokenVestingPlansABI,
              functionName: 'planBalanceOf',
              args: [planId, BigInt(Math.floor(Date.now() / 1000)), BigInt(Math.floor(Date.now() / 1000))],
          });
          const vestedAmount = (vestedResult as unknown as [bigint, bigint])[0] || 0n;

          if (!groupedPlans[tokenAddress]) {
              const name = await readContract(config, { address: tokenAddress as `0x${string}`, abi: ERC20ABI, functionName: 'name' });
              const symbol = await readContract(config, { address: tokenAddress as `0x${string}`, abi: ERC20ABI, functionName: 'symbol' });
              groupedPlans[tokenAddress] = {
                  token: { address: tokenAddress, name: name, symbol: symbol },
                  granted: '0',
                  vested: '0',
                  activePlans: 0,
              };
          }
          
          const currentGranted = parseEther(groupedPlans[tokenAddress].granted);
          const currentVested = parseEther(groupedPlans[tokenAddress].vested);

          groupedPlans[tokenAddress].granted = formatEther(currentGranted + grantedAmount);
          groupedPlans[tokenAddress].vested = formatEther(currentVested + vestedAmount);
          groupedPlans[tokenAddress].activePlans += 1;
        } catch (error) {
          console.error(`Failed to fetch details for plan index ${i}:`, error);
        }
      }

      setPlans(Object.values(groupedPlans));
      setIsLoading(false);
    };

    if (!isFetchingBalance) {
      fetchPlans();
    }
  }, [balanceResult, isConnected, address, isFetchingBalance]);

  return { plans, isLoading };
}