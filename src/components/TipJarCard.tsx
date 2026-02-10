import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sendTip, stxToMicroStx, formatAddress } from '@/lib/stacks';
import { Loader2, Heart, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface TipJarCardProps {
  ownerAddress: string;
  balance?: number;
  isOwner?: boolean;
}

export function TipJarCard({ ownerAddress, balance = 0, isOwner = false }: TipJarCardProps) {
  const { wallet, connect } = useWallet();
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleTip = async () => {
    if (!wallet) {
      connect();
      return;
    }

    const tipAmount = parseFloat(amount);
    if (isNaN(tipAmount) || tipAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSending(true);
    try {
      const txId = await sendTip(ownerAddress, stxToMicroStx(tipAmount));
      if (txId) {
        toast.success('Tip sent!', {
          description: 'Transaction submitted to the network',
          action: {
            label: 'View',
            onClick: () => window.open(`https://explorer.stacks.co/txid/${txId}`, '_blank'),
          },
        });
        setAmount('');
      } else {
        toast.error('Transaction failed');
      }
    } catch {
      toast.error('Failed to send tip');
    } finally {
      setIsSending(false);
    }
  };

  const quickAmounts = [1, 5, 10, 25];

  return (
    <Card className="w-full max-w-md shadow-glow border-2 border-gold/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-display text-2xl">
          {isOwner ? 'Your Tip Jar' : 'Send a Tip'}
        </CardTitle>
        <p className="text-muted-foreground text-sm mt-1">
          {formatAddress(ownerAddress)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Total Received</p>
          <p className="text-4xl font-display font-bold text-gradient-gold">
            {balance.toFixed(2)} STX
          </p>
        </div>

        {!isOwner && (
          <>
            <div className="flex gap-2">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setAmount(amt.toString())}
                >
                  {amt} STX
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount in STX"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
                min="0"
                step="0.1"
              />
              <Button
                onClick={handleTip}
                disabled={isSending}
                className="gradient-gold text-primary-foreground px-6"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Tip
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        <a
          href={`https://explorer.stacks.co/address/${ownerAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View on Explorer
          <ExternalLink className="w-3 h-3" />
        </a>
      </CardContent>
    </Card>
  );
}
