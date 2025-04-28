import { disconnect } from '@wagmi/core';
import { config } from '@/components/WalletConnector/config';
import { NavigateFunction } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'sonner';

export const logout = async (navigate: NavigateFunction) => {
  await disconnect(config);
  useAuthStore.setState({ token: '', address: '' });
  navigate('/');
  toast.success('Logged out successfully');
};
export const logoutUnauthorized = async (navigate: NavigateFunction) => {
  await disconnect(config);
  useAuthStore.setState({ token: '', address: '' });
  navigate('/');
  toast.error('Unauthorized');
};
