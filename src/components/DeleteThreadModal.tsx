import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteThreadApi, updateGameNameApi } from '@/api/commonApi';
import { toast } from 'sonner';
import { TriangleAlert } from 'lucide-react';
import useGamesListStore from '@/store/useGamesListStore';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameRename: (newName: string) => void;
  gameIdOfThreadToDelete: string;
  threadIdToDelete: string;
  updateDeletedThreadState: (latestThreadId: string) => void;
}

const DeleteThreadModal = ({
  isOpen,
  onClose,
  onGameRename,
  gameIdOfThreadToDelete,
  threadIdToDelete,
  updateDeletedThreadState
}: WalletModalProps) => {
  const [gameName, setGameName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { deleteThread } = useGamesListStore();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('threadIdToDelete', threadIdToDelete);
    console.log('gameIdOfThreadToDelete', gameIdOfThreadToDelete);
    const response = await deleteThreadApi(threadIdToDelete);

    if (response === true) {
      deleteThread(threadIdToDelete, gameIdOfThreadToDelete);
      // updateDeletedThreadState(deleteThread(threadId, gameId));
      onClose();
      toast.success('Thread deleted successfully');
    } else {
      toast.error('Failed to delete thread');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-neoplay-black border-2 border-neoplay-green'>
        <DialogHeader>
          <div className='flex items-center justify-center gap-2'>
            <TriangleAlert className='text-neoplay-green font-pixel text-[4rem] w-32 h-32 flex-shrink-0' />
            <DialogTitle className='text-neoplay-green font-pixel text-xl'>
              ARE YOU SURE YOU WANT TO DELETE THIS THREAD?
            </DialogTitle>
          </div>
        </DialogHeader>

        <Button
          onClick={handleSubmit}
          className='bg-neoplay-green text-neoplay-black font-pixel mt-2 hover:bg-green-400 transition-colors'>
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteThreadModal;
