
import { connect, disconnect, isConnected, getLocalStorage, request } from '@stacks/connect';
import { Cl } from '@stacks/transactions';

export const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const CONTRACT_NAME = 'stx-tip-jar';
export const NETWORK = 'mainnet';

export interface WalletData {
  stxAddress: string;
  btcAddress?: string;
}

export async function connectWallet(): Promise<WalletData | null> {
  try {
    if (isConnected()) {
      const userData = getLocalStorage();
      if (userData?.addresses) {
        const addr = userData.addresses as { stx?: { address: string }[]; btc?: { address: string }[] };
        return {
          stxAddress: addr.stx?.[0]?.address || '',
          btcAddress: addr.btc?.[0]?.address,
        };
      }
    }
    
    const response = await connect();
    if (response?.addresses) {
      const addr = response.addresses as { stx?: { address: string }[]; btc?: { address: string }[] };
      return {
        stxAddress: addr.stx?.[0]?.address || '',
        btcAddress: addr.btc?.[0]?.address,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
}

export function disconnectWallet(): void {
  disconnect();
}

export function checkWalletConnection(): WalletData | null {
  if (!isConnected()) return null;
  const userData = getLocalStorage();
  if (userData?.addresses) {
    const addr = userData.addresses as { stx?: { address: string }[]; btc?: { address: string }[] };
    return {
      stxAddress: addr.stx?.[0]?.address || '',
      btcAddress: addr.btc?.[0]?.address,
    };
  }
  return null;
}

export async function createTipJar(): Promise<string | null> {
  try {
    const response = await request('stx_callContract', {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-jar',
      functionArgs: [],
    } as never);
    return (response as { txid?: string })?.txid || null;
  } catch (error) {
    console.error('Failed to create tip jar:', error);
    return null;
  }
}

export async function sendTip(ownerAddress: string, amountInMicroStx: number): Promise<string | null> {
  try {
    const response = await request('stx_callContract', {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'tip',
      functionArgs: [Cl.standardPrincipal(ownerAddress), Cl.uint(amountInMicroStx)],
    } as never);
    return (response as { txid?: string })?.txid || null;
  } catch (error) {
    console.error('Failed to send tip:', error);
    return null;
  }
}

export async function withdrawBalance(): Promise<string | null> {
  try {
    const response = await request('stx_callContract', {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'withdraw',
      functionArgs: [],
    } as never);
    return (response as { txid?: string })?.txid || null;
  } catch (error) {
    console.error('Failed to withdraw:', error);
    return null;
  }
}

export const stxToMicroStx = (stx: number): number => Math.floor(stx * 1_000_000);
export const microStxToStx = (microStx: number): number => microStx / 1_000_000;
export const formatAddress = (address: string): string => 
  !address || address.length < 10 ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;
