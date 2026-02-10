import { Link } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/stacks';
import logo from '@/assets/logo.png';
import { Loader2, LogOut, Wallet } from 'lucide-react';

export function Header() {
  const { wallet, isConnecting, connect, disconnect } = useWallet();

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
          <Button onClick={connect} disabled={isConnecting} className="gradient-gold text-primary-foreground">
            {isConnecting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
