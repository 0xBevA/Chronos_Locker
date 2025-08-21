'use client';

import { useCreatePlan } from '@/hooks/useCreatePlan';
import { useFormStore } from '@/store/formStore';

export function CompleteStep() {
  const { createPlan, isLoading, isSuccess } = useCreatePlan();
  const { isApproved } = useFormStore();

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Complete Vesting Plan Creation</h3>
      <p className="text-sm text-gray-500">
        {isApproved
          ? 'You have approved the contract to spend your tokens. You can now create the vesting plans.'
          : 'Please go back and approve the contract to spend your tokens.'}
      </p>
      <button
        onClick={() => createPlan?.()}
        disabled={!createPlan || isLoading || !isApproved}
        className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-300"
      >
        {isLoading ? 'Creating...' : 'Create Plan'}
      </button>
      {isSuccess && <div className="mt-4 text-green-600">Plans created successfully!</div>}
    </div>
  );
}
