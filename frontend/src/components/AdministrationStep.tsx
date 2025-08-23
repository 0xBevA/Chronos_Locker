'use client';

import { useFormStore } from '@/store/formStore';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { isAddress } from 'viem';

export function AdministrationStep() {
  const {
    vestingAdmin,
    setVestingAdmin,
    isAdminAddressValid,
    setIsAdminAddressValid,
    postVestingLockup,
    setPostVestingLockup,
  } = useFormStore();
  const { address: connectedAddress } = useAccount();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (connectedAddress && !vestingAdmin) {
      setVestingAdmin(connectedAddress);
      setIsAdminAddressValid(true);
    }
  }, [connectedAddress, vestingAdmin, setVestingAdmin, setIsAdminAddressValid]);

  const handleAdminAddressChange = (address: string) => {
    setVestingAdmin(address);
    if (address && !isAddress(address)) {
      setIsAdminAddressValid(false);
    } else {
      setIsAdminAddressValid(true);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <label htmlFor="vesting-admin" className="block text-sm font-medium text-gray-700">
            Vesting admin address
          </label>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:underline text-left sm:text-right">
              Change Vesting admin address
            </button>
          )}
        </div>
        {isEditing ? (
          <>
            <input
              type="text"
              id="vesting-admin"
              className={`mt-1 block w-full px-3 py-2 bg-white border ${
                isAdminAddressValid ? 'border-gray-300' : 'border-red-500'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900`}
              placeholder="Enter vesting admin address"
              value={vestingAdmin}
              onChange={(e) => handleAdminAddressChange(e.target.value)}
            />
            {!isAdminAddressValid && <p className="mt-1 text-sm text-red-600">Invalid Ethereum address.</p>}
          </>
        ) : (
          <div className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900 break-words">
            {vestingAdmin || 'Not set'}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setPostVestingLockup(!postVestingLockup)}
          className={`${
            postVestingLockup ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          role="switch"
          aria-checked={postVestingLockup}
        >
          <span
            aria-hidden="true"
            className={`${
              postVestingLockup ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          ></span>
        </button>
        <span className="ml-3">
          <p className="text-sm font-medium text-gray-900">Enable Recipient Change by Admin</p>
          <p className="text-sm text-gray-500">Allows the Vesting Admin to change the recipient of the plan in emergencies (e.g., lost wallet).</p>
        </span>
      </div>
    </div>
  );
}
