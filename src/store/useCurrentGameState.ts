import { create } from 'zustand';
import { saveFilesToDiskApi } from '@/api/commonApi';
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
  allGameFiles: GameFiles[];
  updateId: number;
  currentGameId: string;
  screenshotData: string;
}
interface ActionsCurrentGameState {
  setGameFiles: (files: GameFiles[]) => void;
  updateGameFiles: (files: GameFiles[]) => void;
  saveFilesToDisk: (address: string, navigate: NavigateFunction) => void;
  deleteGame: (address?: string) => void;
  setScreenshotData: (data: string) => void;
  resetCurrentGameStore: () => void;
  updateCurrentGameStore: (currentGameId: string) => void;
  setUpdateId: (updateId: number) => void;
  increaseUpdateId: () => void;
  updateAllGameFiles: () => void;
  setAllGameFiles: (files: GameFiles[]) => void;
  // setTempId: () => void;
}
const baseUrl = import.meta.env.VITE_BASEURL;

const initialState: VariableCurrentGameState = {
  gameFiles: [],
  allGameFiles: [],
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
      setScreenshotData: (data: string) => set({ screenshotData: data }),
      resetCurrentGameStore: () => set({ ...initialState }),
      updateCurrentGameStore: (currentGameId) => set({ currentGameId }),
      setUpdateId: (updateId) => set({ updateId }),
      increaseUpdateId: () =>
        set((state) => ({ updateId: state.updateId + 1 })),
      updateAllGameFiles: () => {
        const gameFiles = get().gameFiles;
        const allFiles = get().allGameFiles;
        // Upsert logic: use a Map to ensure unique files by filename
        const fileMap = new Map<string, (typeof gameFiles)[0]>();
        allFiles.forEach((file) => fileMap.set(file.filename, file));
        gameFiles.forEach((file) => fileMap.set(file.filename, file)); // overwrite if filename matches
        set({ allGameFiles: Array.from(fileMap.values()) });
      },
      setAllGameFiles: (files) => {
        console.log('setting all game files', files);
        set({ allGameFiles: files });
      }
    }),

    {
      name: 'current-game-state', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage) // properly typed storage for Zustand
    }
  )
);

export default useCurrentGameState;
