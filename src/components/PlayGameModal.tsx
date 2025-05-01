import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from './ui/button';

interface PlayGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentGameURL: string;
}

const PlayGameModal = ({
  isOpen,
  onClose,
  title,
  currentGameURL
}: PlayGameModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='bg-neoplay-black border-2 border-neoplay-green'
        style={{
          width: 650,
          height: 650,
          minWidth: 650,
          minHeight: 650,
          maxWidth: 650,
          maxHeight: 650,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <DialogHeader>
          <DialogTitle className='text-neoplay-green font-pixel text-xl text-center'>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div
          className='border-2 border-neoplay-green rounded overflow-hidden inline-block'
          style={{ width: 600, height: 600 }}>
          <iframe
            src={currentGameURL}
            width='600'
            height='600'
            style={{ border: 0, display: 'block', width: 600, height: 600 }}
            allowFullScreen
          />
        </div>
        <Button
          // onClick={() => connect({ connector })}
          className='retro-btn flex items-center justify-start gap-2 w-full'>
          like
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PlayGameModal;
