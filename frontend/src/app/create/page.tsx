'use client';

import { Stepper, steps as stepNames } from '@/components/Stepper';
import { SetupStep } from '@/components/SetupStep';
import { AdministrationStep } from '@/components/AdministrationStep';
import { DetailsStep } from '@/components/DetailsStep';
import { CompleteStep } from '@/components/CompleteStep';
import { PlanSummary } from '@/components/PlanSummary';
import { useCreatePlan } from '@/hooks/useCreatePlan';
import { ConnectWallet } from '@/components/ConnectWallet';
import { useFormStore } from '@/store/formStore';
import { ReviewStep } from '@/components/ReviewStep';
import Link from 'next/link';

export default function CreatePlanPage() {
  const { data: createPlanData, isLoading: isCreating, isSuccess: isCreateSuccess, createPlan } = useCreatePlan();
  const {
    step,
    setStep,
    tokenAddress,
    vestingTerm,
    cliff,
    isValidAddress,
    isAdminAddressValid,
    plans,
    isApproved,
  } = useFormStore();

  const isStep1Valid = tokenAddress !== '' && vestingTerm > 0 && cliff > 0 && isValidAddress;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SetupStep />;
      case 2:
        return <AdministrationStep />;
      case 3:
        return <DetailsStep />;
      case 4:
        return <ReviewStep />;
      case 5:
        return <CompleteStep />;
      default:
        return <SetupStep />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="flex justify-end items-center mb-4 space-x-4">
        <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300">
          Dashboard
        </Link>
        <ConnectWallet />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 order-2 md:order-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Create a Vesting Plan</h1>
          <div className="md:hidden text-center mb-4">
            <p className="text-lg font-semibold text-blue-600">Step {step}: {stepNames[step - 1]}</p>
          </div>
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
            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-300"
                disabled={
                  (step === 1 && !isStep1Valid) ||
                  (step === 2 && !isAdminAddressValid) ||
                  (step === 3 &&
                    plans.some(
                      (plan) =>
                        !plan.isRecipientValid ||
                        !plan.recipient ||
                        !plan.hasSufficientBalance ||
                        !plan.amount ||
                        !plan.startDate
                    )) ||
                  (step === 4 && !isApproved)
                }
              >
                {step === 3 ? 'Review' : 'Next'}
              </button>
            ) : null}
          </div>
          {isCreateSuccess && (
            <div className="mt-4 text-green-600">
              Plan created successfully! Transaction: {JSON.stringify(createPlanData)}
            </div>
          )}
        </div>
        <div className="md:col-span-1 order-1 md:order-2">
          <PlanSummary />
        </div>
      </div>
    </div>
  );
}