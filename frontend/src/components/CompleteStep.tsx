'use client';

import { useCreatePlan } from '@/hooks/useCreatePlan';
import { useFormStore } from '@/store/formStore';
import Link from 'next/link';
import { useEffect } from 'react';

export function CompleteStep() {
  const { createPlan, isLoading, isSuccess, data } = useCreatePlan();
  const { isApproved, resetForm } = useFormStore();

  useEffect(() => {
    if (isSuccess) {
      resetForm();
    }
  }, [isSuccess, resetForm]);

  return (
    <div className="mt-8 space-y-6 text-center">
      <h3 className="text-2xl font-bold text-gray-900">Complete Vesting Plan Creation</h3>
      <p className="text-gray-600">
        You have approved the contract to spend your tokens. You can now create the vesting plans.
      </p>
      {!isSuccess ? (
        <button
          onClick={() => createPlan?.()}
          disabled={!createPlan || isLoading || !isApproved}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating Plans...' : 'Create Plans'}
        </button>
      ) : (
        <div className="mt-4 text-green-600 space-y-4">
          <div>
            <p>Plans created successfully!</p>
            <p className="text-sm text-gray-500 break-words">Transaction Hash: {data?.toString()}</p>
          </div>
          <Link href="/" className="w-full inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
            Return to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
