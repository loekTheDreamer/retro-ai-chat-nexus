import { create } from 'zustand';
import {
  PublishGame,
  publishGameApi,
  saveFilesToDiskApi
} from '@/api/commonApi';
import { useIframeErrorStore } from '@/store/useIframeErrorStore';
import { NavigateFunction } from 'react-router-dom';
import { logoutUnauthorized } from '@/helpers/logout';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface GameFiles {
  filename: string;
  code: string;
  type: string;
}
interface VariableCurrentGameState {
  gameFiles: GameFiles[];
  updateId: number;
  currentGameId: string;
  screenshotData: string;
}
interface ActionsCurrentGameState {
  setGameFiles: (files: GameFiles[]) => void;
  updateGameFiles: (files: GameFiles[]) => void;
  saveFilesToDisk: (address: string, navigate: NavigateFunction) => void;
  deleteGame: (address?: string) => void;
  publishGame: ({ token, title }: PublishGame) => void;
  setScreenshotData: (data: string) => void;
  resetCurrentGameStore: () => void;
  updateCurrentGameStore: (currentGameId: string) => void;
  // setTempId: () => void;
}
const baseUrl = import.meta.env.VITE_BASEURL;

const initialState: VariableCurrentGameState = {
  gameFiles: [],
  currentGameId: '',
  updateId: 0,
  screenshotData: ''
};

const useCurrentGameState = create<
  VariableCurrentGameState & ActionsCurrentGameState
>()(
  persist(
    (set, get) => ({
      ...initialState,
      setGameFiles: (files) => set({ gameFiles: files }),
      updateGameFiles: (files) =>
        set((state) => ({
          gameFiles: [...state.gameFiles, ...files]
        })),
      saveFilesToDisk: async (token: string, navigate: NavigateFunction) => {
        console.log('sending files to server');
        const gameFiles = get().gameFiles;
        if (!gameFiles.length) {
          console.log('No files to save');
          return;
        }

        const result = await saveFilesToDiskApi({
          gameFiles,
          gameId: get().currentGameId
        });
        if (!result) {
          return;
        }

        if (result === 'Unauthorized') {
          logoutUnauthorized(navigate);
        }

        // useChatStore.setState({
        //   updateIdForGamePreview: useChatStore.getState().updateIdForGamePreview + 1
        // });
        set({ updateId: get().updateId + 1 });
        useIframeErrorStore.getState().resetIframeError();
        return true;
      },
      deleteGame: async (address?: string) => {
        console.log('deleting game', address);
        try {
          const response = await fetch(`${baseUrl}/delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address })
          });
          if (!response.ok) {
            throw new Error('Failed to delete game');
          }
          console.log('Game deleted successfully');
        } catch (error) {
          console.error('Error deleting game:', error);
        }
      },
      publishGame: async ({ token, title }: PublishGame) => {
        console.log('publishing game', token, title);

        if (!token || !title) {
          throw new Error('Missing token or title');
        }

        console.log('currentGameId:', get().currentGameId);

        const theId = get().currentGameId;

        const response = await publishGameApi({
          token,
          title,
          id: theId
        });

        if (!response) {
          throw new Error('Failed to publish game');
        }
        set({ currentGameId: response.id });
        console.log('Game published successfully');
      },
      setScreenshotData: (data: string) => set({ screenshotData: data }),
      resetCurrentGameStore: () => set({ ...initialState }),
      updateCurrentGameStore: (currentGameId) => set({ currentGameId })
    }),

    {
      name: 'current-game-state', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage) // properly typed storage for Zustand
    }
  )
);

export default useCurrentGameState;
