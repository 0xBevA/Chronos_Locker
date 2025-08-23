'use client';

import { ConnectWallet } from '@/components/ConnectWallet';
import Link from 'next/link';
import { useVestingPlans } from '@/hooks/useVestingPlans';
import { useAccount } from 'wagmi';

export default function DashboardPage() {
  const { plans, isLoading } = useVestingPlans();
  const { isConnected } = useAccount();

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vesting Dashboard</h1>
            <p className="text-gray-500">Manage and view all your vesting plans.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/create">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
                Create Vesting Plan
              </button>
            </Link>
            <ConnectWallet />
          </div>
        </header>

        <main>
          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-gray-600 border-b">
              <div className="col-span-2">Token</div>
            <div>Granted tokens</div>
            <div>Vested</div>
            <div className="text-right"></div>
          </div>
          {isLoading && <div className="p-4 text-center text-gray-500">Loading plans...</div>}
          {!isLoading && !isConnected && <div className="p-4 text-center text-gray-500">Please connect your wallet to see your vesting plans.</div>}
          {!isLoading && isConnected && plans.length === 0 && <div className="p-4 text-center text-gray-500">No active vesting plans found.</div>}
          {!isLoading &&
            isConnected &&
            plans.map((plan, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 p-4 items-center border-b last:border-b-0">
                <div className="col-span-2 flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 mr-4">
                    {plan.token.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{plan.token.name}</p>
                    <a
                      href={`https://somnia.w3us.site/token/${plan.token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {plan.token.symbol} ↗
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-900">{parseFloat(plan.granted).toFixed(4)} {plan.token.symbol}</p>
                  <p className="text-sm text-gray-500">~$0.00</p>
                </div>
                <div>
                  <p className="text-gray-900">{parseFloat(plan.vested).toFixed(4)} {plan.token.symbol}</p>
                  <p className="text-sm text-gray-500">~$0.00</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-900">{plan.activePlans}</p>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    View details
                  </button>
                </div>
              </div>
            ))}
        </div>
        </main>
      </div>
    </div>
  );
}
