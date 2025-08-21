'use client';

import { useFormStore } from '@/store/formStore';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

export function AdministrationStep() {
  const { vestingAdmin, setVestingAdmin } = useFormStore();
  const { address: connectedAddress } = useAccount();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (connectedAddress && !vestingAdmin) {
      setVestingAdmin(connectedAddress);
    }
  }, [connectedAddress, vestingAdmin, setVestingAdmin]);

  return (
    <div className="mt-8 space-y-6">
      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="vesting-admin" className="block text-sm font-medium text-gray-700">
            Vesting admin address
          </label>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:underline">
              Change Vesting admin address
            </button>
          )}
        </div>
        {isEditing ? (
          <input
            type="text"
            id="vesting-admin"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            placeholder="Enter vesting admin address"
            value={vestingAdmin}
            onChange={(e) => setVestingAdmin(e.target.value)}
          />
        ) : (
          <div className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
            {vestingAdmin || 'Not set'}
          </div>
        )}
      </div>
    </div>
  );
}
