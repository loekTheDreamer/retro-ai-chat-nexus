import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import useChatStore from './useChatStore';
import useCurrentGameState from './useCurrentGameState';

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
}

const useGamesListStore = create<
  VariableGamesListStore & ActionsGamesListStore
>((set) => ({
  gamesList: [],
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
  }
}));

export default useGamesListStore;
