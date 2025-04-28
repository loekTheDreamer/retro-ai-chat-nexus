import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateGameNameApi } from '@/api/commonApi';
import { toast } from 'sonner';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameRename: (newName: string) => void;
  gameId: string;
}

const RenameGameModal = ({
  isOpen,
  onClose,
  onGameRename,
  gameId
}: WalletModalProps) => {
  const [gameName, setGameName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newName = gameName.trim();
    // only checks if non empty
    if (newName) {
      console.log('gameName:', gameName);
      console.log('gameId:', gameId);

      setIsLoading(true);
      try {
        const response = await updateGameNameApi(newName, gameId);
        if (!response) {
          throw new Error('Failed to update game name');
        }
        console.log('response:', response);
        setIsLoading(false);

        onGameRename(newName);
        setGameName('');
        onClose();
      } catch (error) {
        setIsLoading(false);
        console.error('Error updating game name:', error);
        toast.error('Failed to update game title');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-neoplay-black border-2 border-neoplay-green'>
        <DialogHeader>
          <DialogTitle className='text-neoplay-green font-pixel text-xl text-center'>
            RENAME GAME
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className='sr-only text-neoplay-green/70 font-pixel text-xs text-center'>
          Please enter a new name for your game. This will update the game
          title.
        </DialogDescription>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <input
            id='gameName'
            type='text'
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className='border-2 border-neoplay-green focus:ring-2 focus:ring-neoplay-green bg-neoplay-black text-neoplay-green font-pixel px-3 py-2 rounded outline-none'
            placeholder='Enter new game name'
            autoFocus
          />
          <Button
            type='submit'
            disabled={isLoading}
            className='bg-neoplay-green text-neoplay-black font-pixel mt-2 hover:bg-green-400 transition-colors'>
            {isLoading ? 'Updating...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameGameModal;
