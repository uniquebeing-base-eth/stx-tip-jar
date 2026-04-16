import { useParams } from 'react-router-dom';
import { TipJarCard } from '@/components/TipJarCard';
import { useWallet } from '@/context/WalletContext';
import { useTipJar } from '@/hooks/useTipJar';
import { Loader2 } from 'lucide-react';

export default function TipJarPage() {
  const { address } = useParams<{ address: string }>();
  const { wallet } = useWallet();
  const { exists, balance, isLoading } = useTipJar(address);

  const isOwner = wallet?.stxAddress === address;

  if (!address) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Invalid address</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!exists) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-2">
        <p className="text-xl font-display font-bold">Tip Jar Not Found</p>
        <p className="text-muted-foreground text-sm">This address hasn't created a tip jar yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container flex flex-col items-center">
        <h1 className="font-display text-3xl font-bold mb-8">Tip Jar</h1>
        <TipJarCard
          ownerAddress={address}
          balance={balance}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
