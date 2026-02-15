
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTipJar } from '@/lib/stacks';
import { Loader2, ArrowRight, Sparkles, Search } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const Index = () => {
  const { wallet, isConnecting, connect } = useWallet();
  const navigate = useNavigate();
  const [searchAddress, setSearchAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateJar = async () => {
    if (!wallet) {
      connect();
      return;
    }

    setIsCreating(true);
    try {
      const txId = await createTipJar();
      if (txId) {
        toast.success('Tip jar created!', {
          description: 'Transaction submitted. View your dashboard once confirmed.',
          action: {
            label: 'View',
            onClick: () => window.open(`https://explorer.stacks.co/txid/${txId}`, '_blank'),
          },
        });
        navigate('/dashboard');
      } else {
        toast.error('Failed to create tip jar');
      }
    } catch {
      toast.error('Transaction cancelled or failed');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = () => {
    if (!searchAddress.trim()) {
      toast.error('Please enter a Stacks address');
      return;
    }
    navigate(`/jar/${searchAddress.trim()}`);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-green/5" />
        <div className="container relative py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <img 
              src={logo} 
              alt="STX Tip Jar" 
              className="w-32 h-32 md:w-48 md:h-48 animate-float mb-8"
            />
            
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Receive <span className="text-gradient-gold">STX Tips</span> On-Chain
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Create your tip jar on Stacks blockchain. Get support from your community with secure, decentralized payments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                size="lg"
                onClick={handleCreateJar}
                disabled={isConnecting || isCreating}
                className="gradient-gold text-primary-foreground text-lg h-14 flex-1 shadow-glow"
              >
                {isConnecting || isCreating ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {wallet ? 'Create Your Tip Jar' : 'Connect & Create'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Find a Tip Jar
            </h2>
            <p className="text-muted-foreground mb-6">
              Enter a Stacks address to send a tip
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter STX address (SP...)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12 text-base"
              />
              <Button 
                onClick={handleSearch}
                size="lg"
                className="h-12 px-6"
              >
                <Search className="w-5 h-5 mr-2" />
                Find
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Connect Wallet',
                description: 'Link your Leather or Xverse wallet to get started',
              },
              {
                step: '2',
                title: 'Create Tip Jar',
                description: 'Set up your on-chain tip jar in one transaction',
              },
              {
                step: '3',
                title: 'Receive & Withdraw',
                description: 'Get STX tips and withdraw anytime to your wallet',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-12 h-12 rounded-full gradient-gold text-primary-foreground font-display font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
                {item.step !== '3' && (
                  <ArrowRight className="hidden md:block absolute top-6 -right-4 w-8 h-8 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built on Stacks • STX Tip Jar</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
