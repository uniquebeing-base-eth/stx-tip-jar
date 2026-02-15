
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  connectWallet, 
  disconnectWallet, 
  checkWalletConnection, 
  WalletData 
} from '@/lib/stacks';

interface WalletContextType {
  wallet: WalletData | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected on mount
    const existingConnection = checkWalletConnection();
    if (existingConnection) {
      setWallet(existingConnection);
    }
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const data = await connectWallet();
      if (data) {
        setWallet(data);
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectWallet();
    setWallet(null);
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, isConnecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
