

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/stacks';
import { signalifyLogin } from '@/lib/signalify';
import logo from '@/assets/logo.png';
import { Loader2, LogOut, Wallet, Shield } from 'lucide-react';
import { toast } from 'sonner';


export function Header() {
  const { wallet, isConnecting, connect, disconnect } = useWallet();
  const [signalifyLoading, setSignalifyLoading] = useState(false);

  const handleSignalifyLogin = async () => {
    setSignalifyLoading(true);
    try {
      const user = await signalifyLogin();
      if (user) {
        toast.success(`Signed in as ${user.username}`);
      } else {
        toast.error('Signalify login cancelled or failed');
      }
    } catch {
      toast.error('Signalify login failed');
    } finally {
      setSignalifyLoading(false);
    }
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="STX Tip Jar" className="w-10 h-10" />
          <span className="font-display font-bold text-xl hidden sm:block">STX Tip Jar</span>
        </Link>

        {wallet ? (
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
              <div className="w-2 h-2 rounded-full bg-green" />
              <span className="text-sm font-medium">{formatAddress(wallet.stxAddress)}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={disconnect}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSignalifyLogin}
              disabled={signalifyLoading}
              variant="outline"
              className="flex items-center"
            >
              {signalifyLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Signalify
            </Button>
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="gradient-gold text-primary-foreground flex items-center"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4 mr-2" />
              )}
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
