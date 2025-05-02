import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Game } from './PublishedGames';

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
        <Button
          onClick={onClose}
          className='retro-btn items-center justify-center gap-2 w-full'
          // className='retro-btn items-center justify-start gap-2'
        >
          close
        </Button>
        {!selectedGame?.likedByMe && (
          <Button
            onClick={() => likeGame(selectedGame.id)}
            className='retro-btn items-center justify-center gap-2 w-full'
            // className='retro-btn items-center justify-start gap-2'
          >
            like
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayGameModal;
