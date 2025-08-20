'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <p>Connected to {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }
  return <button onClick={() => connect()}>Connect Wallet</button>;
}
import { Stepper } from '@/components/Stepper';
import { SetupStep } from '@/components/SetupStep';
import { PlanSummary } from '@/components/PlanSummary';
import { useCreatePlan } from '@/hooks/useCreatePlan';

export default function Home() {
  const { data, isLoading, isSuccess, createPlan } = useCreatePlan();

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create a Vesting Plan</h1>
          <Stepper />

          <SetupStep />

          <div className="mt-8 flex justify-end">
            <button
              disabled={!createPlan || isLoading}
              onClick={() => createPlan?.()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-300"
            >
              {isLoading ? 'Creating...' : 'Next: Administration'}
            </button>
          </div>
          {isSuccess && (
            <div className="mt-4 text-green-600">Plan created successfully! Transaction: {JSON.stringify(data)}</div>
          )}
        </div>
        <div className="col-span-1">
          <PlanSummary />
        </div>
      </div>
    </div>
  );
}
