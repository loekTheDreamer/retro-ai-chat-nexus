import { create } from 'zustand';
import { publishGameApi, saveFilesToDiskApi } from '@/api/commonApi';
import { useIframeErrorStore } from '@/store/useIframeErrorStore';
import { NavigateFunction } from 'react-router-dom';
import { logoutUnauthorized } from '@/helpers/logout';

export interface GameFiles {
  filename: string;
  code: string;
  type: string;
}

interface PublishGame {
  address?: string;
  title: string;
}

interface CurrentGameState {
  gameFiles: GameFiles[];
  currentGameId: string;
  setGameFiles: (files: GameFiles[]) => void;
  updateGameFiles: (files: GameFiles[]) => void;
  saveFilesToDisk: (address: string, navigate: NavigateFunction) => void;
  tempId: number;
  deleteGame: (address?: string) => void;
  publishGame: ({ address, title }: PublishGame) => void;
  // setTempId: () => void;
}
const baseUrl = import.meta.env.VITE_BASEURL;

const useCurrentGameState = create<CurrentGameState>((set, get) => ({
  gameFiles: [],
  tempId: 0,
  currentGameId: '',
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
      token
    });
    if (!result) {
      return;
    }

    if (result === 'Unauthorized') {
      logoutUnauthorized(navigate);
    }

    set({ tempId: get().tempId + 1 });
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
  publishGame: async ({ address, title }: PublishGame) => {
    console.log('publishing game', address, title);

    if (!address || !title) {
      throw new Error('Missing address or title');
    }

    console.log('currentGameId:', get().currentGameId);

    const theId = get().currentGameId;

    const response = await publishGameApi({
      address,
      title,
      id: theId
    });

    if (!response) {
      throw new Error('Failed to publish game');
    }
    set({ currentGameId: response.id });
    console.log('Game published successfully');
  }

  // try {
  //   const response = await fetch(`${baseUrl}/publish`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ address, title })
  //   });
  //   if (!response.ok) {
  //     throw new Error('Failed to publish game');
  //   }
  //   console.log('Game published successfully');
  // } catch (error) {
  //   console.error('Error publishing game:', error);
  // }
}));

export default useCurrentGameState;
