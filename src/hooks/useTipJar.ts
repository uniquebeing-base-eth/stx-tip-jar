import { useQuery } from '@tanstack/react-query';
import { tipJarExists, getTipJarBalance } from '@/lib/stacks';

interface UseTipJarOptions {
  refetchInterval?: number;
}

export function useTipJar(address: string | undefined, options?: UseTipJarOptions) {
  const refetchInterval = options?.refetchInterval ?? 15000;

  const existsQuery = useQuery({
    queryKey: ['tipJar', 'exists', address],
    queryFn: () => tipJarExists(address!),
    enabled: !!address,
    refetchInterval,
  });

  const balanceQuery = useQuery({
    queryKey: ['tipJar', 'balance', address],
    queryFn: () => getTipJarBalance(address!),
    enabled: !!address && existsQuery.data === true,
    refetchInterval,
  });

  return {
    exists: existsQuery.data ?? false,
    balance: balanceQuery.data ?? 0,
    isLoading: existsQuery.isLoading,
    isError: existsQuery.isError,
  };
}
