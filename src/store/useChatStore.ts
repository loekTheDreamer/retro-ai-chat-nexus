import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/message';

// export interface ChatMessage {
//   id: string;
//   type: 'user' | 'assistant' | 'system' | 'error';
//   content: string;
//   timestamp?: string;
// }

interface ChatState {
  threadId: string;
  chatHistory: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  updateLastAssistantMessage: (content: string) => void;
}

const useChatStore = create<ChatState>((set) => ({
  threadId: '',
  chatHistory: [],
  isLoading: false,
  addMessage: (message) => {
    set((state) => ({
      chatHistory: [...state.chatHistory, message]
    }));
  },
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ chatHistory: [] }),
  updateLastAssistantMessage: (content) => {
    set((state) => {
      const newHistory = [...state.chatHistory];
      // Assumes caller has already checked last message is assistant
      newHistory[newHistory.length - 1] = {
        ...newHistory[newHistory.length - 1],
        content
      };
      return { chatHistory: newHistory };
    });
  }
}));

export default useChatStore;
