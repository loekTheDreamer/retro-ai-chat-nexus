import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, Pencil } from 'lucide-react';
import {
  addThreadApi,
  getThreadsApi,
  getUserGamesApi,
  updateGameNameApi
} from '@/api/commonApi';
import useAuthStore from '@/store/useAuthStore';
import RenameGameModal from './RenameGameModal';
import useChatStore from '@/store/useChatStore';
import useCurrentGameState from '@/store/useCurrentGameState';

interface GamesList {
  createdAt: string;
  id: string;
  name: string;
  status: string;
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
  const [gamesList, setGamesList] = useState<GamesList[]>([]);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [updatedGameName, setUpdatedGameName] = useState('');
  const [gameIdToUpdate, setGameIdToUpdate] = useState('');
  const [onMount, setOnMount] = useState(false);

  const { token } = useAuthStore();
  const {
    threadId,
    setThreadId,
    setReplaceChatHistory,
    resetChatStore,
    updateChatStore
  } = useChatStore();
  const { resetCurrentGameStore, updateCurrentGameStore } =
    useCurrentGameState();

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
    // console.log('handlePencilHoverEnter', gameId);
    pencilTimers.current[gameId] = setTimeout(() => {
      // console.log('setShowPencilFor TRUE for', gameId);
      setShowPencilFor((prev) => ({ ...prev, [gameId]: true }));
    }, 300); // 700ms delay
  };

  const handlePencilHoverLeave = (gameId: string) => {
    // console.log('handlePencilHoverLeave', gameId);
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
    console.log('threadId:', threadId);
    if (onMount) {
      return;
    }

    const getGames = async () => {
      console.log('gogogo');
      const { latestGame, gameList } = await getUserGamesApi(token, threadId);
      console.log('latestGame:', latestGame);
      console.log(
        'latestGame.threads[0].messages: ',
        latestGame.threads[0].messages[0]
      );
      // console.log('gameList:', gameList);
      setGamesList(gameList);
      setThreadId(latestGame.threads[0].id); // need to return the last game on with but also a list of the games
      setReplaceChatHistory(latestGame.threads[0].messages);
      updateCurrentGameStore(latestGame.id);
      setOnMount(true);
    };

    getGames();
  }, [
    onMount,
    setReplaceChatHistory,
    setThreadId,
    threadId,
    token,
    updateCurrentGameStore
  ]);

  const handleGameRename = (newName: string) => {
    // setUpdatedGameName(newName);
    const updatedGames = gamesList.map((game) => {
      if (game.id === gameIdToUpdate) {
        return { ...game, name: newName };
      }
      return game;
    });
    setGamesList(updatedGames);
  };

  const handleAddThread = async (gameId: string) => {
    const newThread = await addThreadApi(gameId);
    console.log('newThread:', newThread.id);
    resetChatStore(newThread.id);
    resetCurrentGameStore();
  };

  const handleThreadClick = async (id: string, currentGameId: string) => {
    const thread = await getThreadsApi(id);
    console.log('thread:', id);
    console.log('thread.messages22', thread.messages);
    updateChatStore(id, thread.messages);
    updateCurrentGameStore(currentGameId);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`w-64 border-r-2 border-neoplay-green overflow-y-auto animate-slide-in-left`}>
      <div className='p-4'>
        <h2 className='font-pixel text-sm mb-4'>GAME PROJECTS</h2>

        <div className='space-y-2'>
          {gamesList.map((game) => (
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
                      className={`mr-1 z-10 transition-opacity duration-700 ${
                        showPencilFor[game.id]
                          ? 'opacity-100 pointer-events-auto'
                          : 'opacity-0 pointer-events-none'
                      }`}
                      onClick={() => {
                        setGameIdToUpdate(game.id);
                        setIsGameModalOpen(true);
                        // updateGameNameApi('newName', game.id);
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
                  {game.threads.map((thread, index) => (
                    <button
                      key={thread.id}
                      onClick={() => handleThreadClick(thread.id, game.id)}
                      className='w-full text-left p-2 text-xs hover:bg-neoplay-gray border-b border-neoplay-green last:border-b-0'>
                      {thread.messages.length > 0
                        ? thread.messages[0].content
                        : `Thread #${game.threads.length - index}`}
                    </button>
                  ))}
                  <button
                    className='w-full text-left p-2 text-xs text-neoplay-darkGreen hover:bg-neoplay-gray flex items-center'
                    onClick={() => handleAddThread(game.id)}>
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
      <RenameGameModal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        onGameRename={handleGameRename}
        gameId={gameIdToUpdate}
      />
    </div>
  );
};

export default LeftPanel;
