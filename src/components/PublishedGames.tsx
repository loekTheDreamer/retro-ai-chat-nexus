import {
  getPublishedGamesApi,
  likePublishedGameApi,
  playPublishedGameApi
} from '@/api/publishApi';
import { useCallback, useEffect, useState } from 'react';
import PlayGameModal from './PlayGameModal';
import { Heart, Play } from 'lucide-react';

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
  const [onMount, setOnMount] = useState(false);
  const [isPlayGameModalOpen, setIsPlayGameModalOpen] = useState(false);
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  // const [playedGameIds, setPlayedGameIds] = useState<Set<string>>(new Set());

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

  const handlePlayGame = (game: Game) => {
    // title={game.name}
    // currentGameURL={game.url}
    console.log('game', game);
    setSelectedGame(game);

    setSelectedGameUrl(
      `https://${VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN}/published/${game.id}/index.html`
    );
    setIsPlayGameModalOpen(true);
    setGames((prev) =>
      prev.map((g) =>
        g.id === game.id ? { ...g, playedByMe: true, plays: g.plays + 1 } : g
      )
    );
    // setSelectedGame((prev) =>
    //   prev && prev.id === game.id
    //     ? { ...prev, playedByMe: true }
    //     : prev
    // );
    playPublishedGameApi(game.id, game.playedByMe);
  };

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
      {/* <h2 className="text-3xl font-bold mb-6 text-neoplay-purple">Published Games</h2> */}
      <div className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 lg:gap-6 w-full'>
        {games.map((game) => (
          <div
            key={game.id}
            className='border-2 border-neoplay-green p-4 hover:bg-neoplay-gray cursor-pointer transition-colors w-[250px] h-[400px] mx-auto'
          >
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
        onClose={() => setIsPlayGameModalOpen(false)}
        selectedGame={selectedGame}
        currentGameURL={selectedGameUrl}
        likeGame={likeGame}
      />
    </div>
  );
};

export default PublishedGames;
