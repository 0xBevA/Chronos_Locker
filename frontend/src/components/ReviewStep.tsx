'use client';

import { useFormStore } from '@/store/formStore';
import { useApprove } from '@/hooks/useApprove';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { useEffect } from 'react';
import { useAllowance } from '@/hooks/useAllowance';
import { parseEther } from 'viem';

interface Token {
  address: string;
  name: string;
  symbol: string;
}

interface TokenBalance {
  token: Token;
  value: string;
}

export function ReviewStep() {
  const {
    tokenAddress,
    unlockFrequency,
    vestingTerm,
    vestingTermUnit,
    cliff,
    cliffUnit,
    vestingAdmin,
    plans,
    isApproved,
    setStep,
    setIsApproved,
    postVestingLockup,
  } = useFormStore();
  const { data: approveData, isLoading: isApproving, isSuccess: isApproveSuccess, approve } = useApprove();
  const { tokenBalances } = useTokenBalances();
  const { allowance, refetch: refetchAllowance } = useAllowance(tokenAddress as `0x${string}`);

  const totalAmount = plans.reduce((acc, plan) => {
    try {
      return acc + parseEther(plan.amount);
    } catch {
      return acc;
    }
  }, 0n);

  useEffect(() => {
    if (typeof allowance === 'bigint' && allowance >= totalAmount) {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  }, [allowance, totalAmount, setIsApproved]);

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  const selectedToken = tokenBalances?.find((balance: TokenBalance) => balance.token.address === tokenAddress);

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Review Plan Details</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Token & Schedule</h3>
          <div className="mt-2 space-y-2 text-gray-800 bg-gray-50 p-4 rounded-md">
            <p><span className="font-semibold">Token:</span> {selectedToken?.token.name} ({selectedToken?.token.symbol})</p>
            <p><span className="font-semibold">Total Amount:</span> {totalAmount} {selectedToken?.token.symbol}</p>
            <p><span className="font-semibold">Unlock Frequency:</span> {unlockFrequency}</p>
            <p><span className="font-semibold">Vesting Term:</span> {vestingTerm} {vestingTermUnit}</p>
            <p><span className="font-semibold">Cliff:</span> {cliff} {cliffUnit}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Administration</h3>
          <div className="mt-2 space-y-2 text-gray-800 bg-gray-50 p-4 rounded-md">
            <p><span className="font-semibold">Vesting Admin:</span> {vestingAdmin}</p>
            <p><span className="font-semibold">Recipient Change by Admin:</span> {postVestingLockup ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Recipients</h3>
          <div className="mt-2 space-y-2 text-gray-800 bg-gray-50 p-4 rounded-md">
            {plans.map((plan, index) => (
              <div key={index} className="p-2 border-b">
                <p><span className="font-semibold">Recipient #{index + 1}:</span> {plan.recipient}</p>
                <p><span className="font-semibold">Amount:</span> {plan.amount} {selectedToken?.token.symbol}</p>
                <p><span className="font-semibold">Start Date:</span> {plan.startDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isApproved ? (
        <button
          onClick={() => approve?.()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-300"
          disabled={!approve || isApproving}
        >
          {isApproving ? 'Approving...' : `Approve`}
        </button>
      ) : (
        <div className="mt-4 text-center text-green-600">
          <p>You have approved the necessary amount. You can now proceed to the final step.</p>
        </div>
      )}
    </div>
  );
}