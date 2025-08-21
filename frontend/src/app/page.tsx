'use client';

import { Stepper } from '@/components/Stepper';
import { SetupStep } from '@/components/SetupStep';
import { AdministrationStep } from '@/components/AdministrationStep';
import { DetailsStep } from '@/components/DetailsStep';
import { CompleteStep } from '@/components/CompleteStep';
import { PlanSummary } from '@/components/PlanSummary';
import { useCreatePlan } from '@/hooks/useCreatePlan';
import { useApprove } from '@/hooks/useApprove';
import { ConnectWallet } from '@/components/ConnectWallet';
import { useFormStore } from '@/store/formStore';

export default function Home() {
  const { data: createPlanData, isLoading: isCreating, isSuccess: isCreateSuccess, createPlan } = useCreatePlan();
  const { data: approveData, isLoading: isApproving, isSuccess: isApproveSuccess, approve } = useApprove();
  const { step, setStep, tokenAddress, vestingTerm, cliff, setIsApproved } = useFormStore();

  if (isApproveSuccess) {
    setIsApproved(true);
  }

  const isStep1Valid = tokenAddress !== '' && vestingTerm > 0 && cliff > 0;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SetupStep />;
      case 2:
        return <AdministrationStep />;
      case 3:
        return <DetailsStep />;
      case 4:
        return <CompleteStep />;
      default:
        return <SetupStep />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="flex justify-end mb-4">
        <ConnectWallet />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl mx-auto grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create a Vesting Plan</h1>
          <Stepper />

          {renderStep()}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => {
                  if (step === 3) {
                    approve?.();
                  } else {
                    setStep(step + 1);
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-300"
                disabled={(step === 1 && !isStep1Valid) || (step === 3 && (!approve || isApproving))}
              >
                {step === 3 ? (isApproving ? 'Approving...' : 'Approve') : 'Next'}
              </button>
            ) : null}
          </div>
          {isApproveSuccess && (
            <div className="mt-4 text-green-600">
              Approval successful! You can now proceed to create the plans.
              <button onClick={() => setStep(4)} className="ml-2 text-blue-600 hover:underline">
                Go to final step
              </button>
            </div>
          )}
          {isCreateSuccess && (
            <div className="mt-4 text-green-600">
              Plan created successfully! Transaction: {JSON.stringify(createPlanData)}
            </div>
          )}
        </div>
        <div className="col-span-1">
          <PlanSummary />
        </div>
      </div>
    </div>
  );
}
