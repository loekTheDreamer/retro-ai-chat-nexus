import { disconnect } from '@wagmi/core';
import { config } from '@/components/WalletConnector/config';
import { NavigateFunction } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'sonner';
import useCurrentGameState from '@/store/useCurrentGameState';
import useGamesListStore from '@/store/useGamesListStore';
import useChatStore from '@/store/useChatStore';

const resetAllStores = async (navigate: NavigateFunction) => {
  await disconnect(config);
  useAuthStore.setState({ token: '', address: '' });
  useCurrentGameState.getState().resetCurrentGameStore();
  useGamesListStore.getState().resetGamesListStore();
  useChatStore.getState().resetEntireChatStore();
  navigate('/');
};

export const logout = async (navigate: NavigateFunction) => {
  resetAllStores(navigate);
  toast.success('Logged out successfully');
};
export const logoutUnauthorized = async (navigate: NavigateFunction) => {
  resetAllStores(navigate);
  toast.error('Unauthorized');
};
