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
  setAuth: (token: string, address: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: '',
      address: '',
      setAuth: (token: string, address: string) => {
        set({ token, address });
      }
    }),
    {
      name: 'auth-storage' // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
