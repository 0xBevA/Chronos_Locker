import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const somniaTestnet = {
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: { http: ['https://enterprise.onerpc.com/somnia_testnet?apikey=Ku3gV1hlxVE3wPUH5aeLC126NpZfO2Sg'] },
    public: { http: ['https://enterprise.onerpc.com/somnia_testnet?apikey=Ku3gV1hlxVE3wPUH5aeLC126NpZfO2Sg'] },
  },
  blockExplorers: {
    default: { name: 'SomniaScan', url: 'https://somnia.w3us.site' },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: 'Chronos Locker',
  // TODO: Replace with your own WalletConnect Project ID
  projectId: '1a2b3c4d5e6f7g8h9i0j',
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http(),
  },
});
