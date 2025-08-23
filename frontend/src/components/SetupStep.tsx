'use client';

import { useFormStore } from '@/store/formStore';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { isAddress, formatEther } from 'viem';
import { useState, useEffect } from 'react';

interface Token {
  address: string;
  name: string;
  symbol: string;
}

interface TokenBalance {
  token: Token;
  value: string;
}

export function SetupStep() {
  const {
    tokenAddress,
    setTokenAddress,
    unlockFrequency,
    setUnlockFrequency,
    vestingTerm,
    setVestingTerm,
    vestingTermUnit,
    setVestingTermUnit,
    cliff,
    setCliff,
    cliffUnit,
    setCliffUnit,
    postVestingLockup,
    setPostVestingLockup,
    isValidAddress,
    setIsValidAddress,
  } = useFormStore();
  const { tokenBalances, isLoading } = useTokenBalances();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleAddressChange = (address: string) => {
    setTokenAddress(address);
    if (address && !isAddress(address)) {
      setIsValidAddress(false);
    } else {
      setIsValidAddress(true);
    }
  };

  const freqButtonClasses = (freq: 'Linear' | 'Periodic' | 'Single') =>
    `px-4 py-2 border text-sm font-medium ${
      unlockFrequency === freq ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-500'
    }`;

  return (
    <div className="mt-8 space-y-6">
      <div>
        <label htmlFor="token-address" className="block text-sm font-medium text-gray-700">
          Token
        </label>
        <select
          id="token-address"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
          value={tokenAddress}
          onChange={(e) => {
            setTokenAddress(e.target.value);
            setIsValidAddress(true);
          }}
        >
          <option value="">{isLoading ? 'Loading tokens...' : 'Select a token'}</option>
          {tokenBalances?.map((balance: TokenBalance) => (
            <option key={balance.token.address} value={balance.token.address}>
              {isMobile
                ? `${balance.token.symbol} - ${parseFloat(formatEther(BigInt(balance.value))).toFixed(4)}`
                : `${balance.token.name} (${balance.token.symbol}) - Balance: ${parseFloat(
                    formatEther(BigInt(balance.value))
                  ).toFixed(4)}`}
            </option>
          ))}
        </select>
        <input
          type="text"
          className={`mt-2 block w-full px-3 py-2 bg-white border ${
            isValidAddress ? 'border-gray-300' : 'border-red-500'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900`}
          placeholder="Or paste token contract address"
          value={tokenAddress}
          onChange={(e) => handleAddressChange(e.target.value)}
        />
        {!isValidAddress && <p className="mt-1 text-sm text-red-600">Invalid Ethereum address.</p>}
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700">Unlock frequency</p>
        <div className="mt-2 flex rounded-md shadow-sm">
          <button
            onClick={() => setUnlockFrequency('Linear')}
            className={`${freqButtonClasses('Linear')} rounded-l-md border-gray-300`}
          >
            Linear
          </button>
          <button
            onClick={() => setUnlockFrequency('Periodic')}
            className={`${freqButtonClasses('Periodic')} border-t border-b border-gray-300`}
          >
            Periodic
          </button>
          <button
            onClick={() => setUnlockFrequency('Single')}
            className={`${freqButtonClasses('Single')} rounded-r-md border-gray-300`}
          >
            Single
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="vesting-term" className="block text-sm font-medium text-gray-700">
            Vesting term
          </label>
          <div className="mt-1 flex">
            <input
              type="number"
              value={vestingTerm}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setVestingTerm(isNaN(value) ? 0 : value);
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded-l-md text-gray-900"
            />
            <select
              value={vestingTermUnit}
              onChange={(e) => setVestingTermUnit(e.target.value as 'years' | 'months' | 'days')}
              className="px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50 text-gray-900"
            >
              <option value="years">years</option>
              <option value="months">months</option>
              <option value="days">days</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="cliff" className="block text-sm font-medium text-gray-700">
            Cliff
          </label>
          <div className="mt-1 flex">
            <input
              type="number"
              value={cliff}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setCliff(isNaN(value) ? 0 : value);
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded-l-md text-gray-900"
            />
            <select
              value={cliffUnit}
              onChange={(e) => setCliffUnit(e.target.value as 'years' | 'months' | 'days')}
              className="px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50 text-gray-900"
            >
              <option value="years">years</option>
              <option value="months">months</option>
              <option value="days">days</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}
