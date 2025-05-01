import { getPublishedGamesApi } from '@/api/commonApi';
import { useCallback, useEffect, useState } from 'react';
import PlayGameModal from './PlayGameModal';
import { Heart, Play } from 'lucide-react';

const VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN = import.meta.env
  .VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN;

interface Game {
  id: string;
  name: string;
  description: string;
  publisher: {
    walletAddress: string;
  };
  plays: number;
  genre: string;
  tags: string[];
}

const PublishedGames = () => {
  const [onMount, setOnMount] = useState(false);
  const [isPlayGameModalOpen, setIsPlayGameModalOpen] = useState(false);
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [selectedGameTitle, setSelectedGameTitle] = useState<string | null>(
    null
  );
  const [games, setGames] = useState<Game[]>([]);

  const fetchPublishedGames = useCallback(async () => {
    console.log('fetching published games');
    try {
      const response = await getPublishedGamesApi();
      if (response.publishedGames) {
        const one = response.publishedGames[0];
        const two = response.publishedGames[0];
        const three = response.publishedGames[0];
        console.log('response', response);
        // setGames(response.publishedGames);
        setGames([one, two, three, one, two, three]);
      }
    } catch (error) {
      console.error('Error fetching user games:', error);
    }
  }, []);

  useEffect(() => {
    // if (!onMount) return;

    fetchPublishedGames();
    // setOnMount(true);
  }, [fetchPublishedGames]);

  const handlePlayGame = (gameId: string, gameTitle: string) => {
    // title={game.name}
    // currentGameURL={game.url}
    setSelectedGameTitle(gameTitle);
    setSelectedGameUrl(
      `https://${VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN}/published/${gameId}/index.html`
    );
    setIsPlayGameModalOpen(true);
  };

  return (
    <div className='h-full overflow-auto p-6'>
      {/* <h1 className='font-pixel text-2xl mb-6 text-center'>PUBLISHED GAMES</h1> */}

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {games.map((game) => (
          <div
            key={game.id}
            className='border-2 border-neoplay-green p-4 hover:bg-neoplay-gray cursor-pointer transition-colors'>
            <h2 className='font-pixel text-lg'>{game.name}</h2>

            <div className='h-48 bg-neoplay-gray mt-2 flex items-center justify-center'>
              <img
                // src={`${VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN}/published/${game.id}/img/coverImage.png`}
                src={`https://${VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN}/published/${
                  game.id
                }/img/coverImage.png?${Date.now()}`}
                alt='Game Cover'
                className='max-h-48 object-contain'
              />

              {/* <span className='font-pixel text-sm'>GAME PREVIEW</span> */}
            </div>

            <p className='mt-3 text-sm'>{game.description}</p>

            <div className='flex justify-between items-center mt-4 text-xs'>
              <span>
                BY: {game.publisher.walletAddress.slice(2, 6)}...
                {game.publisher.walletAddress.slice(-4)}
              </span>
            </div>
            <div className='flex justify-between items-center mt-4 text-xs'>
              <span className='inline-flex items-center gap-1'>
                <Play
                  className='w-4 h-4 text-neoplay-green'
                  fill='currentColor'
                />
                {game.plays.toLocaleString()}
              </span>

              <span className='inline-flex items-center gap-1'>
                <Heart
                  className='w-4 h-4 text-neoplay-green'
                  fill='currentColor'
                />
                {game.likes ?? 0}
              </span>
            </div>

            <button
              className='retro-btn w-full mt-3 text-sm py-1'
              onClick={() => handlePlayGame(game.id, game.name)}>
              PLAY NOW
            </button>
          </div>
        ))}
      </div>
      <PlayGameModal
        isOpen={isPlayGameModalOpen}
        onClose={() => setIsPlayGameModalOpen(false)}
        title={selectedGameTitle}
        currentGameURL={selectedGameUrl}
      />
    </div>
  );
};

export default PublishedGames;
