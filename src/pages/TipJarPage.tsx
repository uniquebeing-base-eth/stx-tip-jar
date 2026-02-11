
import { useParams } from 'react-router-dom';
import { TipJarCard } from '@/components/TipJarCard';
import { useWallet } from '@/context/WalletContext';

export default function TipJarPage() {
  const { address } = useParams<{ address: string }>();
  const { wallet } = useWallet();
  
  const isOwner = wallet?.stxAddress === address;

  if (!address) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Invalid address</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container flex flex-col items-center">
        <h1 className="font-display text-3xl font-bold mb-8">Tip Jar</h1>
        <TipJarCard 
          ownerAddress={address} 
          balance={0} // In production, fetch from contract
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
