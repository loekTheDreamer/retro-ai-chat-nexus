import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import useChatStore from './useChatStore';
import useCurrentGameState from './useCurrentGameState';
import { toast } from 'sonner';

export interface ThreadMessage {
  id: string;
  createdAt: string;
  content: string;
  sender: string;
  isUser: boolean;
  role: string;
}

interface Thread {
  id: string;
  createdAt: string;
  messages: ThreadMessage[];
}
export interface GamesList {
  createdAt: string;
  id: string;
  name: string;
  status: string;
  threads: Thread[];
}

interface GameWithThread {
  coverImageUrl: string;
  createdAt: string;
  description: string;
  genre: string;
  id: string;
  name: string;
  plays: number;
  publisherId: string;
  status: string;
  tags: string[];
  threads: Thread[];
  updatedAt: string;
}

interface VariableGamesListStore {
  gamesList: GamesList[];
}

interface ActionsGamesListStore {
  setGamesList: (gamesList: GamesList[]) => void;
  addThreadToGame: (gameId: string, threadId: string) => void;
  addGameToGamesList: (newGame: GameWithThread) => void;
  updateThreadMessage: (message: string) => void;
  deleteThread: (threadId: string, currentGameId: string) => void;
  resetGamesListStore: () => void;
}

const initialState: VariableGamesListStore = {
  gamesList: []
};

const useGamesListStore = create<
  VariableGamesListStore & ActionsGamesListStore
>((set) => ({
  ...initialState,
  setGamesList: (gamesList) => set({ gamesList }),
  addThreadToGame: (gameId, threadId) =>
    set((state) => ({
      gamesList: state.gamesList.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            threads: [
              {
                id: threadId,
                createdAt: new Date().toISOString(),
                messages: []
              },
              ...game.threads
            ]
          };
        }
        return game;
      })
    })),
  addGameToGamesList: (gameWithThread) =>
    set((state) => ({
      gamesList: [
        {
          ...gameWithThread,
          threads: [
            {
              id: gameWithThread.threads[0].id,
              createdAt: new Date().toISOString(),
              messages: []
            }
          ]
        },
        ...state.gamesList
      ]
    })),
  updateThreadMessage: (message) => {
    const { threadId } = useChatStore.getState();
    const { currentGameId } = useCurrentGameState.getState();
    set((state) => ({
      gamesList: state.gamesList.map((game) => {
        if (game.id === currentGameId) {
          return {
            ...game,
            threads: game.threads.map((thread) => {
              if (thread.id === threadId) {
                return {
                  ...thread,
                  messages: [
                    ...thread.messages,
                    {
                      id: uuidv4(),
                      createdAt: new Date().toISOString(),
                      content: message,
                      sender: 'user',
                      isUser: true,
                      role: 'user'
                    }
                  ]
                };
              }
              return thread;
            })
          };
        }
        return game;
      })
    }));
  },
  deleteThread: (threadId: string, currentGameId: string) => {
    const { threadId: selectedThreadId, setThreadId } = useChatStore.getState();
    let error: string | null = null;
    set((state) => {
      const updatedGamesList = state.gamesList.map((game) => {
        if (game.id === currentGameId) {
          // Prevent deletion if only one thread exists
          if (game.threads.length === 1) {
            toast.error("Can't delete thread: only one thread available.");
            error = "Can't delete thread: only one thread available.";
            return game;
          }
          const filteredThreads = game.threads.filter(
            (thread) => thread.id !== threadId
          );
          if (selectedThreadId === threadId) {
            const latestThread = filteredThreads.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0];
            if (latestThread) {
              setThreadId(latestThread.id);
              // Use the latest threads from the updated game object to update chatHistory
              const updatedThreads = [...filteredThreads];
              const currentThread = updatedThreads.find(
                (t) => t.id === latestThread.id
              );
              if (currentThread) {
                useChatStore.getState().setReplaceChatHistory(
                  currentThread.messages.map((msg) => ({
                    ...msg,
                    role: msg.role as 'user' | 'assistant' | 'system'
                  }))
                );
              }
            }
          }
          return {
            ...game,
            threads: filteredThreads
          };
        }
        return game;
      });
      return { gamesList: updatedGamesList };
    });
    if (error) {
      throw new Error(error);
    }
  },
  resetGamesListStore: () => set({ ...initialState })
}));

export default useGamesListStore;
