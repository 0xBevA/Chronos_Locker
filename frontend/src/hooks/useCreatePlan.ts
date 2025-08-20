import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { utils } from 'ethers';
import { TokenVestingPlansABI } from '@/abi/TokenVestingPlans';

const contractAddress = '0xB60945f33FaC45e8D44b11f54d7c4CE90dc15996'; // From deployed-contracts.txt

import { useFormStore } from '@/store/formStore';

export function useCreatePlan() {
  const { tokenAddress } = useFormStore();
  // NOTE: Other form state values will be used here to calculate the args

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: TokenVestingPlansABI,
    functionName: 'createPlan',
    // TODO: Replace placeholders with actual calculated values from form state
    args: [
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // recipient (placeholder)
      tokenAddress, // token
      utils.parseEther('1000'), // amount (placeholder)
      Math.floor(Date.now() / 1000), // start (current time)
      Math.floor(Date.now() / 1000) + 31536000, // cliff (1 year from now)
      1, // rate (placeholder)
      1, // period (placeholder)
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // vestingAdmin (placeholder)
      false, // adminTransferOBO
    ],
    enabled: utils.isAddress(tokenAddress), // Only enable the hook if the token address is valid
  });

  const { data, isLoading, isSuccess, write: createPlan } = useContractWrite(config);

  return { data, isLoading, isSuccess, createPlan };
}
