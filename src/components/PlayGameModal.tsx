import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Game } from './PublishedGames';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN = import.meta.env.VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN;

interface PlayGameModalProps {
  selectedGame: Game | null;
  isOpen: boolean;
  onClose: () => void;
  // title: string;
  currentGameURL: string;
  likeGame: (gameId: string) => void;
  // selectedGameId: string;
}

const PlayGameModal = ({
  isOpen,
  onClose,
  currentGameURL,
  likeGame,
  selectedGame
}: PlayGameModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    try {
      // Create a URL with the game ID as a query parameter
      const url = new URL(window.location.href);
      url.searchParams.set('game', selectedGame?.id || '');
      
      // Copy the URL to clipboard
      await navigator.clipboard.writeText(url.toString());
      setIsCopied(true);
      toast.success('Game link copied to clipboard!');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
      console.error('Failed to copy link: ', err);
    }
  };
  
  console.log('selectedGame', selectedGame?.likedByMe);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='bg-neoplay-black border-2 border-neoplay-green'
        style={{
          // width: 650,
          // height: 650,
          minWidth: 650,
          minHeight: 650,
          // maxWidth: 650,
          // maxHeight: 650,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <DialogHeader>
          <DialogTitle className='text-neoplay-green font-pixel text-xl text-center'>
            {selectedGame?.name}
          </DialogTitle>
        </DialogHeader>
        <div
          className='border-2 border-neoplay-green rounded overflow-hidden inline-block'
          style={{ width: 600, height: 600, maxWidth: 600, maxHeight: 600 }}>
          <iframe
            src={currentGameURL}
            width='600'
            height='600'
            style={{
              border: 0,
              display: 'block',
              width: 600,
              height: 600,
              maxWidth: 600,
              maxHeight: 600
            }}
            allowFullScreen
          />
        </div>
        <div className='flex gap-2 w-full'>
          <Button
            onClick={handleShare}
            className='retro-btn items-center justify-center gap-2 flex-1 bg-neoplay-green hover:bg-neoplay-green/90 text-neoplay-black'
          >
            {isCopied ? (
              <>
                <Check className='h-4 w-4' />
                Copied!
              </>
            ) : (
              <>
                <Copy className='h-4 w-4' />
                Share
              </>
            )}
          </Button>
          {!selectedGame?.likedByMe && (
            <Button
              onClick={() => likeGame(selectedGame.id)}
              className='retro-btn items-center justify-center gap-2 flex-1'
            >
              Like
            </Button>
          )}
          <Button
            onClick={onClose}
            className='retro-btn items-center justify-center gap-2 flex-1'
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayGameModal;
