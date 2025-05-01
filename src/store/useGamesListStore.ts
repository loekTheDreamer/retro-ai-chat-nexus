import { create } from 'zustand';

interface Message {
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
  messages: Message[];
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
    }))
}));

export default useGamesListStore;
