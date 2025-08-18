import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
// import jwt_decode from 'jwt-decode';
import { persist, createJSONStorage } from 'zustand/middleware';

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

interface AuthState {
  token: string;
  address: string;
  password: string;
  setAuth: (token: string, address: string) => void;
  setPassword: (password: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: '',
      address: '',
      password: '',
      setAuth: (token: string, address: string) => {
        set({ token, address });
      },
      setPassword: (password: string) => {
        set({ password });
      }
    }),
    {
      name: 'auth-storage' // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
