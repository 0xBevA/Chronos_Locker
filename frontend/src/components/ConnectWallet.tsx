'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="text-sm text-right">
        <p>Connected: {`${address?.slice(0, 6)}...${address?.slice(-4)}`}</p>
        <button onClick={() => disconnect()} className="text-red-500 hover:underline font-semibold">
          Disconnect
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => connect()}
      className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
    >
      Connect Wallet
    </button>
  );
}
