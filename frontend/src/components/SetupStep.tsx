'use client';

import { useFormStore } from '@/store/formStore';

export function SetupStep() {
  const {
    tokenAddress,
    setTokenAddress,
    // ... other state and setters will be used here
  } = useFormStore();

  return (
    <div className="mt-8 space-y-6">
      <div>
        <label htmlFor="token-address" className="block text-sm font-medium text-gray-700">
          Token
        </label>
        <input
          type="text"
          id="token-address"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Select or paste token contract address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700">Unlock frequency</p>
        <div className="mt-2 flex rounded-md shadow-sm">
          <button className="px-4 py-2 border border-gray-300 bg-blue-50 text-blue-700 rounded-l-md text-sm font-medium">
            Linear
          </button>
          <button className="px-4 py-2 border-t border-b border-gray-300 text-gray-500 bg-white text-sm font-medium">
            Periodic
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-500 bg-white rounded-r-md text-sm font-medium">
            Single
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="vesting-term" className="block text-sm font-medium text-gray-700">
            Vesting term
          </label>
          <div className="mt-1 flex">
            <input type="number" defaultValue="3" className="w-20 px-3 py-2 border border-gray-300 rounded-l-md" />
            <select className="px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50">
              <option>years</option>
              <option>months</option>
              <option>days</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="cliff" className="block text-sm font-medium text-gray-700">
            Cliff
          </label>
          <div className="mt-1 flex">
            <input type="number" defaultValue="1" className="w-20 px-3 py-2 border border-gray-300 rounded-l-md" />
            <select className="px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50">
              <option>years</option>
              <option>months</option>
              <option>days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          role="switch"
          aria-checked="true"
        >
          <span
            aria-hidden="true"
            className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          ></span>
        </button>
        <span className="ml-3">
          <p className="text-sm font-medium text-gray-900">Enable post-vesting lockup</p>
          <p className="text-sm text-gray-500">Adds additional scheduling for fine-grained control.</p>
        </span>
      </div>
    </div>
  );
}
