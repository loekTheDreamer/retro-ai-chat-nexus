import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, Pencil } from 'lucide-react';
import { getUserGamesApi } from '@/api/commonApi';
import useAuthStore from '@/store/useAuthStore';

interface Game {
  id: string;
  name: string;
  threads: Thread[];
}

interface Message {
  id: string;
  createdAt: string;
  content: string;
  sender: string;
  isUser: boolean;
}

interface Thread {
  id: string;
  createdAt: string;
  messages: Message[];
}

interface LeftPanelProps {
  isOpen: boolean;
}

const LeftPanel = ({ isOpen }: LeftPanelProps) => {
  const [games, setGames] = useState<Game[]>([]);

  const { token } = useAuthStore();

  const [expandedGames, setExpandedGames] = useState<Record<string, boolean>>({
    '1': true,
    '2': false,
    '3': false
  });

  // --- Pencil delayed hover state ---
  const [showPencilFor, setShowPencilFor] = useState<Record<string, boolean>>(
    {}
  );
  const pencilTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  const handlePencilHoverEnter = (gameId: string) => {
    console.log('handlePencilHoverEnter', gameId);
    pencilTimers.current[gameId] = setTimeout(() => {
      console.log('setShowPencilFor TRUE for', gameId);
      setShowPencilFor((prev) => ({ ...prev, [gameId]: true }));
    }, 300); // 700ms delay
  };

  const handlePencilHoverLeave = (gameId: string) => {
    console.log('handlePencilHoverLeave', gameId);
    clearTimeout(pencilTimers.current[gameId]);
    setShowPencilFor((prev) => ({ ...prev, [gameId]: false }));
  };

  useEffect(() => {
    return () => {
      // Clean up timers on unmount
      const timers = pencilTimers.current;
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);
  // --- End Pencil delayed hover state ---

  const toggleGameExpand = (gameId: string) => {
    setExpandedGames((prev) => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
  };

  useEffect(() => {
    const getGames = async () => {
      const games = await getUserGamesApi(token);
      console.log('games:', games);
      setGames(games);
    };
    getGames();
  }, [token]);

  if (!isOpen) return null;

  return (
    <div
      className={`w-64 border-r-2 border-neoplay-green overflow-y-auto animate-slide-in-left`}>
      <div className='p-4'>
        <h2 className='font-pixel text-sm mb-4'>GAME PROJECTS</h2>

        <div className='space-y-2'>
          {games.map((game) => (
            <div key={game.id} className='border border-neoplay-green'>
              <button
                onClick={() => toggleGameExpand(game.id)}
                onMouseEnter={() => handlePencilHoverEnter(game.id)}
                onMouseLeave={() => handlePencilHoverLeave(game.id)}
                className='flex items-center justify-between w-full p-2 hover:bg-neoplay-gray text-left'>
                <span className='flex items-center gap-2 font-mono text-sm truncate '>
                  {game.name}
                  <span className='relative flex items-center'>
                    <Pencil
                      size={12}
                      className={`mr-1 z-10 transition-opacity duration-700 ${showPencilFor[game.id] ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                      onClick={() => {
                        console.log('click');
                      }}
                    />
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    expandedGames[game.id] ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {expandedGames[game.id] && (
                <div className='pl-4 border-t border-neoplay-green'>
                  {game.threads.map((thread) => (
                    <button
                      key={thread.id}
                      className='w-full text-left p-2 text-xs hover:bg-neoplay-gray border-b border-neoplay-green last:border-b-0'>
                      {thread.messages.length > 0
                        ? thread.messages[0].content
                        : 'Talk to newPlay to update'}
                    </button>
                  ))}
                  <button className='w-full text-left p-2 text-xs text-neoplay-darkGreen hover:bg-neoplay-gray flex items-center'>
                    <Plus size={12} className='mr-1' />
                    <span>NEW THREAD</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className='retro-btn w-full mt-4 text-sm py-1 flex items-center justify-center'>
          <Plus size={16} className='mr-1' />
          <span>NEW GAME PROJECT</span>
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;
