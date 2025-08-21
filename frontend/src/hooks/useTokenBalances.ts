import useSWR from 'swr';
import { useAccount } from 'wagmi';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTokenBalances() {
  const { address, isConnected } = useAccount();

  const apiUrl = isConnected ? `https://somnia.w3us.site/api/v2/addresses/${address}/token-balances` : null;

  const { data, error } = useSWR(apiUrl, fetcher);

  return {
    tokenBalances: data,
    isLoading: !error && !data,
    isError: error,
  };
}
