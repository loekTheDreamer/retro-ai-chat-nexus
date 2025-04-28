import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Connector, useConnect } from 'wagmi';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletSelect: (wallet: string) => void;
}

const WalletModal = ({ isOpen, onClose, onWalletSelect }: WalletModalProps) => {
  const { connectors, connect } = useConnect();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-neoplay-black border-2 border-neoplay-green'>
        <DialogHeader>
          <DialogTitle className='text-neoplay-green font-pixel text-xl text-center'>
            CONNECT WALLET
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => connect({ connector })}
              className='retro-btn flex items-center justify-start gap-2 w-full'>
              <WalletOption connector={connector} />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;

function WalletOption({ connector }: { connector: Connector }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <div className='flex items-center gap-2'>
      <Wallet className='w-5 h-5' />
      {connector.name}
    </div>
  );
}
