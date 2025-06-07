import {
  getPublishedGamesApi,
  likePublishedGameApi,
  playPublishedGameApi
} from '@/api/publishApi';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PlayGameModal from './PlayGameModal';
import { Heart, Play } from 'lucide-react'; 
import { toast } from 'sonner';

const VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN = import.meta.env
  .VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN;

export interface Game {
  id: string;
  name: string;
  description: string;
  publisher: {
    walletAddress: string;
  };
  plays: number;
  genre: string;
  tags: string[];
  _count: {
    likedBy: number;
  };
  likedByMe: boolean;
  playedByMe: boolean;
}

const PublishedGames = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPlayGameModalOpen, setIsPlayGameModalOpen] = useState(false);
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // const [playedGameIds, setPlayedGameIds] = useState<Set<string>>(new Set());

  const fetchPublishedGames = useCallback(async () => {
    console.log('fetching published games');
    try {
      const response = await getPublishedGamesApi();
      if (response.publishedGames) {
        const one = response.publishedGames[0];
        // const two = response.publishedGames[0];
        // const three = response.publishedGames[0];
        console.log('response', response);
        setGames(response.publishedGames);
        // setGames([one, two, three, one, two, three]);
      }
    } catch (error) {
      console.error('Error fetching user games:', error);
    }
  }, []);

  // Handle initial load with game ID in URL
  useEffect(() => {
    const loadInitialGame = async () => {
      // Only fetch games if we don't have them yet
      if (games.length === 0) {
        await fetchPublishedGames();
      }
      
      const gameId = searchParams.get('game');
      if (gameId) {
        // Give it a moment for games to load if needed
        const findAndOpenGame = () => {
          const gameToOpen = games.find(g => g.id === gameId);
          if (gameToOpen) {
            setSelectedGame(gameToOpen);
            setSelectedGameUrl(`https://${VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN}/published/${gameToOpen.id}/index.html`);
            setIsPlayGameModalOpen(true);
            
            // Update play count if not already played
            if (!gameToOpen.playedByMe) {
              setGames(prev =>
                prev.map(g =>
                  g.id === gameToOpen.id 
                    ? { ...g, playedByMe: true, plays: g.plays + 1 } 
                    : g
                )
              );
              playPublishedGameApi(gameToOpen.id, gameToOpen.playedByMe);
            }
          } else if (games.length > 0) {
            // If we have games but didn't find this one
            toast.error('Game not found');
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('game');
            setSearchParams(newSearchParams);
          }
        };
        
        // If games are already loaded, open immediately
        if (games.length > 0) {
          findAndOpenGame();
        } else {
          // Otherwise, wait a bit for games to load
          const timer = setTimeout(() => {
            findAndOpenGame();
          }, 500);
          return () => clearTimeout(timer);
        }
      }
    };
    
    loadInitialGame();
  }, [searchParams, games, fetchPublishedGames, setSearchParams]);
  
  // Close modal and clean up URL when modal is closed
  const handleCloseModal = () => {
    setIsPlayGameModalOpen(false);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('game');
    setSearchParams(newSearchParams);
  };

  const handlePlayGame = useCallback((game: Game) => {
    console.log('game', game);
    setSelectedGame(game);

    const gameUrl = `https://${VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN}/published/${game.id}/index.html`;
    setSelectedGameUrl(gameUrl);
    
    // Update URL with the game ID
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('game', game.id);
    setSearchParams(newSearchParams);
    
    // Update play count if not already played
    if (!game.playedByMe) {
      setGames(prev =>
        prev.map(g =>
          g.id === game.id 
            ? { ...g, playedByMe: true, plays: g.plays + 1 } 
            : g
        )
      );
      playPublishedGameApi(game.id, game.playedByMe);
    }
    
    setIsPlayGameModalOpen(true);
  }, [searchParams, setSearchParams]);

  const likeGame = (gameId: string) => {
    likePublishedGameApi(gameId);
    setGames((prev) =>
      prev.map((game) =>
        game.id === gameId
          ? {
              ...game,
              likedByMe: true,
              _count: {
                ...game._count,
                likedBy: game._count.likedBy + 1
              }
            }
          : game
      )
    );
    setSelectedGame((prev) =>
      prev && prev.id === gameId
        ? {
            ...prev,
            likedByMe: true,
            _count: {
              ...prev._count,
              likedBy: prev._count.likedBy + 1
            }
          }
        : prev
    );
  };

  return (
    <div className='w-full py-6 px-4 md:px-6'>
      <h2 className='text-3xl font-bold mb-6 text-neoplay-purple'>
        Published Games
      </h2>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-20 w-full justify-center'>
        {games.map((game) => (
          <div
            key={game.id}
            className='border-2 border-neoplay-green p-4 hover:bg-neoplay-gray cursor-pointer transition-colors w-[250px] h-[400px] mx-auto'>
            <h2 className='font-pixel text-lg truncate'>{game.name}</h2>

            <div className='h-48 bg-neoplay-gray mt-2 flex items-center justify-center w-full overflow-hidden'>
              <img
                // src={`${VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN}/published/${game.id}/img/coverImage.png`}
                src={`https://${VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN}/published/${
                  game.id
                }/img/coverImage.png?${Date.now()}`}
                alt='Game Cover'
                className='h-full w-full object-cover'
              />

              {/* <span className="font-pixel text-sm">GAME PREVIEW</span> */}
            </div>

            <p className='mt-3 text-sm line-clamp-3'>{game.description}</p>

            <div className='flex justify-between items-center mt-2 text-xs'>
              <span>
                BY: {game.publisher.walletAddress.slice(2, 6)}...
                {game.publisher.walletAddress.slice(-4)}
              </span>
            </div>
            <div className='flex justify-between items-center mt-2 text-xs'>
              <span className='inline-flex items-center gap-1'>
                <Play
                  className='w-4 h-4 text-neoplay-green'
                  fill={game.playedByMe ? 'currentColor' : undefined}
                />
                {game.plays}
              </span>

              <span className='inline-flex items-center gap-1'>
                <Heart
                  className='w-4 h-4 text-neoplay-green'
                  fill={game.likedByMe && 'currentColor'}
                />
                {game._count.likedBy}
              </span>
            </div>

            <button
              className='retro-btn w-full mt-3 text-sm py-1'
              onClick={() => handlePlayGame(game)}>
              PLAY NOW
            </button>
          </div>
        ))}
      </div>
      <PlayGameModal
        isOpen={isPlayGameModalOpen}
        onClose={handleCloseModal}
        selectedGame={selectedGame}
        currentGameURL={selectedGameUrl}
        likeGame={likeGame}
      />
    </div>
  );
};

export default PublishedGames;
