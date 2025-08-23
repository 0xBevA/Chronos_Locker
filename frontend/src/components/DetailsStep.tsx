'use client';

import { useFormStore } from '@/store/formStore';
import { useTokenBalances } from '@/hooks/useTokenBalances';
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

export function DetailsStep() {
  const { plans, addPlan, removePlan, updatePlan, tokenAddress, setPlanBalanceValidity } = useFormStore();
  const { tokenBalances } = useTokenBalances();

  const selectedToken = tokenBalances?.find((balance: TokenBalance) => balance.token.address === tokenAddress);

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleAmountChange = (index: number, amount: string) => {
    updatePlan(index, 'amount', amount);

    if (selectedToken && amount) {
      try {
        const amountInWei = parseEther(amount);
        const balanceInWei = BigInt(selectedToken.value);
        setPlanBalanceValidity(index, amountInWei <= balanceInWei);
      } catch {
        setPlanBalanceValidity(index, false);
      }
    } else {
      setPlanBalanceValidity(index, true);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {plans.map((plan, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-900">Plan #{index + 1}</h3>
            <button onClick={() => removePlan(index)} className="text-red-500 hover:underline">
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-900">Recipient address</label>
              <input
                type="text"
                className={`mt-1 block w-full px-3 py-2 bg-white border ${
                  plan.isRecipientValid ? 'border-gray-300' : 'border-red-500'
                } rounded-md shadow-sm text-gray-900`}
                value={plan.recipient}
                onChange={(e) => updatePlan(index, 'recipient', e.target.value)}
              />
              {!plan.isRecipientValid && <p className="mt-1 text-sm text-red-600">Invalid Ethereum address.</p>}
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-900">
                Amount of tokens {selectedToken && `(${selectedToken.token.symbol})`}
              </label>
              <input
                type="text"
                className={`mt-1 block w-full px-3 py-2 bg-white border ${
                  plan.hasSufficientBalance ? 'border-gray-300' : 'border-red-500'
                } rounded-md shadow-sm text-gray-900`}
                value={plan.amount}
                onChange={(e) => handleAmountChange(index, e.target.value)}
              />
              {!plan.hasSufficientBalance && (
                <p className="mt-1 text-sm text-red-600">Insufficient balance.</p>
              )}
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-900">Vesting start date</label>
              <input
                type="date"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                value={plan.startDate}
                min={getTomorrow()}
                onChange={(e) => updatePlan(index, 'startDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addPlan}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <svg
          className="-ml-0.5 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Plan
      </button>
    </div>
  );
}
