import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { withdrawBalance, formatAddress, createTipJar } from '@/lib/stacks';
import { Loader2, Copy, Check, ExternalLink, Sparkles, ArrowDownToLine, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

export default function Dashboard() {
  const { wallet, connect } = useWallet();
  const navigate = useNavigate();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock state - in production, fetch from contract
  const [hasJar] = useState(true);
  const balance = 125.5; // Mock balance

  if (!wallet) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Connect your wallet to view your dashboard</p>
        <Button onClick={connect} className="gradient-gold text-primary-foreground">
          Connect Wallet
        </Button>
      </div>
    );
  }

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const txId = await withdrawBalance();
      if (txId) {
        toast.success('Withdrawal initiated!', {
          description: 'Your STX is on the way to your wallet',
          action: {
            label: 'View',
            onClick: () => window.open(`https://explorer.stacks.co/txid/${txId}`, '_blank'),
          },
        });
      } else {
        toast.error('Withdrawal failed');
      }
    } catch {
      toast.error('Transaction cancelled or failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleCreateJar = async () => {
    setIsCreating(true);
    try {
      const txId = await createTipJar();
      if (txId) {
        toast.success('Tip jar created!', {
          description: 'Transaction submitted to the network',
        });
      }
    } catch {
      toast.error('Failed to create tip jar');
    } finally {
      setIsCreating(false);
    }
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/jar/${wallet.stxAddress}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasJar) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container max-w-md">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <img src={logo} alt="STX Tip Jar" className="w-24 h-24 mx-auto mb-4 opacity-50" />
              <h2 className="font-display text-xl font-bold mb-2">No Tip Jar Yet</h2>
              <p className="text-muted-foreground mb-6">Create your tip jar to start receiving STX</p>
              <Button
                onClick={handleCreateJar}
                disabled={isCreating}
                className="gradient-gold text-primary-foreground"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Create Tip Jar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-lg">
        <h1 className="font-display text-3xl font-bold text-center mb-8">Your Dashboard</h1>

        <Card className="mb-6 shadow-glow border-2 border-gold/20">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-display font-bold text-gradient-gold mb-6">
              {balance.toFixed(2)} STX
            </p>
            
            <Button
              onClick={handleWithdraw}
              disabled={isWithdrawing || balance <= 0}
              size="lg"
              className="w-full gradient-green text-secondary-foreground h-14 text-lg"
            >
              {isWithdrawing ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-5 h-5 mr-2" />
              )}
              Withdraw All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Share Your Tip Jar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <code className="text-sm flex-1 truncate">{formatAddress(wallet.stxAddress)}</code>
              <Button variant="ghost" size="icon" onClick={copyShareLink}>
                {copied ? <Check className="w-4 h-4 text-green" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/jar/${wallet.stxAddress}`)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Page
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={copyShareLink}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
