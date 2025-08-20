import { createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const somniaTestnet = {
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SOM',
    symbol: 'SOM',
  },
  rpcUrls: {
    default: { http: ['https://enterprise.onerpc.com/somnia_testnet?apikey=Ku3gV1hlxVE3wPUH5aeLC126NpZfO2Sg'] },
    public: { http: ['https://enterprise.onerpc.com/somnia_testnet?apikey=Ku3gV1hlxVE3wPUH5aeLC126NpZfO2Sg'] },
  },
  blockExplorers: {
    default: { name: 'SomniaScan', url: 'https://somnia.w3us.site' },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains([somniaTestnet], [publicProvider()]);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});
