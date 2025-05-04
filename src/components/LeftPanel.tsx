import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  addThreadApi,
  createNewGame,
  deleteThreadApi,
  getThreadsApi,
  getUserGamesApi,
  updateGameNameApi
} from '@/api/commonApi';
import useAuthStore from '@/store/useAuthStore';
import RenameGameModal from './RenameGameModal';
import useChatStore from '@/store/useChatStore';
import useCurrentGameState from '@/store/useCurrentGameState';
import { toast } from 'sonner';
import useGamesListStore, {
  GamesList,
  ThreadMessage
} from '@/store/useGamesListStore';
import { Message } from '@/types/message';
import DeleteThreadModal from './DeleteThreadModal';

// interface GamesList {
//   createdAt: string;
//   id: string;
//   name: string;
//   status: string;
//   threads: Thread[];
// }

interface LeftPanelProps {
  isOpen: boolean;
}

const LeftPanel = ({ isOpen }: LeftPanelProps) => {
  const [showTrashFor, setShowTrashFor] = useState<Record<string, boolean>>({});
  const trashTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  // const [gamesList, setGamesList] = useState<GamesList[]>([]);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isDeleteThreadModalOpen, setIsDeleteThreadModalOpen] = useState(false);
  const [gameIdToUpdate, setGameIdToUpdate] = useState('');
  const [onMount, setOnMount] = useState(false);
  const [threadIdToDelete, setThreadIdToDelete] = useState('');
  const [gameIdOfThreadToDelete, setGameIdOfThreadToDelete] = useState('');
  // console.log('gamesList:', gamesList);
  const {
    gamesList,
    setGamesList,
    addThreadToGame,
    addGameToGamesList,
    deleteThread
  } = useGamesListStore();
  const { token } = useAuthStore();
  const {
    threadId,
    setThreadId,
    setReplaceChatHistory,
    resetChatStore,
    updateChatStore
  } = useChatStore();
  const { increaseUpdateId, updateCurrentGameStore, setAllGameFiles } =
    useCurrentGameState();

  useEffect(() => {
    console.log('gamesList:', gamesList);
  }, [gamesList]);

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

  const handleTrashHoverEnter = (threadId: string) => {
    trashTimers.current[threadId] = setTimeout(() => {
      setShowTrashFor((prev) => ({ ...prev, [threadId]: true }));
    }, 300);
  };
  const handleTrashHoverLeave = (threadId: string) => {
    clearTimeout(trashTimers.current[threadId]);
    setShowTrashFor((prev) => ({ ...prev, [threadId]: false }));
  };
  useEffect(() => {
    return () => {
      Object.values(trashTimers.current).forEach(clearTimeout);
    };
  }, []);

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
      const { latestGame, gameList, files } = await getUserGamesApi(
        token,
        threadId
      );
      console.log('latestGame:', latestGame);
      setAllGameFiles(files);
      // console.log(
      //   'latestGame.threads[0].messages: ',
      //   latestGame.threads[0].messages[0].role
      // );
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
    setAllGameFiles,
    setGamesList,
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
    const { id, codeBlocks, files } = await addThreadApi(gameId);

    if (id === undefined) {
      toast.error('your already have a perfectly good thread at your disposal');
      return;
    }
    console.log('codeBlocks', codeBlocks);
    resetChatStore(id, codeBlocks);
    updateCurrentGameStore(gameId);
    addThreadToGame(gameId, id);
    setAllGameFiles(files);
    // setGamesList((prev) => {
    //   return prev.map((game) => {
    //     if (game.id === gameId) {
    //       // Add the new thread to the correct game
    //       return {
    //         ...game,
    //         threads: [
    //           {
    //             id,
    //             createdAt: new Date().toISOString(),
    //             messages: []
    //           },`
    //           ...game.threads
    //         ]
    //       };
    //     }
    //     return game;
    //   });
    // });
  };

  const handleThreadClick = async (id: string, selectedGameId: string) => {
    console.log('selectedGameId!!!!!', selectedGameId);
    const { thread, allGameFiles } = await getThreadsApi(id, selectedGameId);
    console.log('handleThreadClick allGameFiles', allGameFiles);
    if (allGameFiles) {
      setAllGameFiles(allGameFiles);
    } else {
      setAllGameFiles([]);
    }

    console.log('thread:', id);
    console.log('thread.messages22', thread);
    updateChatStore(id, thread.messages);
    console.log('selectedGameId!!!!!', selectedGameId);
    updateCurrentGameStore(selectedGameId);
    increaseUpdateId();
  };

  const handleCreateNewGame = async () => {
    const gameWithThread = await createNewGame();
    console.log('newGame:', gameWithThread);
    if (gameWithThread.success === false) {
      toast.error(
        "You haven't made a game yet, why do you need a new project?"
      );
      return;
    }
    resetChatStore(gameWithThread.threads[0].id);
    updateCurrentGameStore(gameWithThread.id);

    addGameToGamesList(gameWithThread);
    setAllGameFiles([]);
  };

  // const handleOpenGame = (game: GamesList) => {
  //   const threadDiv = game.threads.map((thread, index) => {
  //     console.log('creating thread names:', thread.messages);
  //     if (
  //       thread.messages.length === 0 ||
  //       (thread.messages.length === 1 &&
  //         thread.messages[0].role === 'assistant')
  //     ) {
  //       console.log('test::', thread.messages.length);
  //       return (
  //         <button
  //           key={thread.id}
  //           onClick={() => handleThreadClick(thread.id, game.id)}
  //           className='w-full text-left p-2 text-xs hover:bg-neoplay-gray border-b border-neoplay-green last:border-b-0'>
  //           {`Thread #${game.threads.length - index}`}
  //         </button>
  //       );
  //     }

  //     if (thread.messages.length > 0 && thread.messages[0].role == 'user') {
  //       console.log('this should have trigger');
  //       return (
  //         <button
  //           key={thread.id}
  //           onClick={() => handleThreadClick(thread.id, game.id)}
  //           className='w-full text-left p-2 text-xs hover:bg-neoplay-gray border-b border-neoplay-green last:border-b-0'>
  //           {thread.messages[0].content.length > 47
  //             ? thread.messages[0].content.slice(0, 47).trim() + '...'
  //             : thread.messages[0].content}
  //         </button>
  //       );
  //     }

  //     if (thread.messages.length > 0 && thread.messages[1].role == 'user') {
  //       console.log('this should have trigger');
  //       return (
  //         <button
  //           key={thread.id}
  //           onClick={() => handleThreadClick(thread.id, game.id)}
  //           className='w-full text-left p-2 text-xs hover:bg-neoplay-gray border-b border-neoplay-green last:border-b-0'>
  //           {thread.messages[1].content.length > 47
  //             ? thread.messages[1].content.slice(0, 47).trim() + '...'
  //             : thread.messages[1].content}
  //         </button>
  //       );
  //     }
  //   });

  //   return threadDiv;
  // };

  const handleName = (
    messages: ThreadMessage[],
    index: number,
    threadLength: number
  ) => {
    let name: string;
    // console.log('messages:', messages);
    if (
      messages.length === 0 ||
      (messages.length === 1 && messages[0].role === 'assistant')
    ) {
      name = `Thread #${threadLength - index}`;
      return name;
    }

    if (messages.length > 0 && messages[0].role == 'user') {
      name =
        messages[0].content.length > 47
          ? messages[0].content.slice(0, 47).trim() + '...'
          : messages[0].content;
      return name;
    }

    if (messages.length > 0 && messages[1].role == 'user') {
      name =
        messages[1].content.length > 47
          ? messages[1].content.slice(0, 47).trim() + '...'
          : messages[1].content;
      return name;
    }
  };

  const handlePencilClick = (event: React.MouseEvent, gameId: string) => {
    event.stopPropagation();
    setGameIdToUpdate(gameId);
    setIsGameModalOpen(true);
  };

  const handleTrashClick = async (
    event: React.MouseEvent,
    toDeleteGameId: string,
    toDeleteThreadId: string
  ) => {
    event.stopPropagation();
    console.log('toDeleteGameId', toDeleteGameId);
    console.log('toDeleteThreadId', toDeleteThreadId);
    setGameIdOfThreadToDelete(toDeleteGameId);
    setThreadIdToDelete(toDeleteThreadId);
    setIsDeleteThreadModalOpen(true);

    console.log('click');
  };

  const updateDeletedThreadState = (latestThreadId: string) => {
    setThreadId(latestThreadId);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`w-64 border-r-2 border-neoplay-green overflow-y-auto animate-slide-in-left`}>
      <div className='p-4'>
        <h2 className='font-pixel text-sm mb-4'>GAME PROJECTS</h2>

        <div className='space-y-2'>
          {gamesList.map((game, index) => (
            <div key={game.id} className='border border-neoplay-green'>
              <button
                onClick={() => toggleGameExpand(game.id)}
                onMouseEnter={() => handlePencilHoverEnter(game.id)}
                onMouseLeave={() => handlePencilHoverLeave(game.id)}
                className='flex items-center justify-between w-full p-2 hover:bg-neoplay-gray text-left'>
                <span className='flex items-center gap-2 font-mono text-sm truncate '>
                  {game.name === 'Untitled Game'
                    ? 'Untitled Game #' + (gamesList.length - index)
                    : game.name}
                  <span className='relative flex items-center'>
                    <Pencil
                      size={12}
                      className={`mr-1 z-10 transition-opacity duration-700 ${
                        showPencilFor[game.id]
                          ? 'opacity-100 pointer-events-auto'
                          : 'opacity-0 pointer-events-none'
                      }`}
                      onClick={(event) => handlePencilClick(event, game.id)}
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
                <div className=' border-t border-neoplay-green'>
                  {/* {handleOpenGame(game)} */}
                  {game.threads.map((thread, index) => (
                    <button
                      key={thread.id}
                      onClick={() => handleThreadClick(thread.id, game.id)}
                      className='w-full text-left p-2 text-xs hover:bg-neoplay-gray border-b border-neoplay-green last:border-b-0'
                      onMouseEnter={() => handleTrashHoverEnter(thread.id)}
                      onMouseLeave={() => handleTrashHoverLeave(thread.id)}>
                      {/* {`Thread #${game.threads.length - index}`} */}
                      <span className='relative flex items-center'>
                        <span className='mr-4'>
                          {handleName(
                            thread.messages,
                            index,
                            game.threads.length
                          )}
                        </span>
                        <Trash2
                          size={16}
                          className={`absolute right-0 top-1/2 -translate-y-1/2 text-neoplay-green cursor-pointer transition-opacity duration-700 ${
                            showTrashFor[thread.id]
                              ? 'opacity-100 pointer-events-auto'
                              : 'opacity-0 pointer-events-none'
                          }`}
                          onClick={(event) =>
                            handleTrashClick(event, game.id, thread.id)
                          }
                        />
                      </span>
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

        <button
          className='retro-btn w-full mt-4 text-sm py-1 flex items-center justify-center'
          onClick={handleCreateNewGame}>
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
      <DeleteThreadModal
        isOpen={isDeleteThreadModalOpen}
        onClose={() => setIsDeleteThreadModalOpen(false)}
        onGameRename={handleGameRename}
        gameIdOfThreadToDelete={gameIdOfThreadToDelete}
        threadIdToDelete={threadIdToDelete}
        updateDeletedThreadState={updateDeletedThreadState}
      />
    </div>
  );
};

export default LeftPanel;
