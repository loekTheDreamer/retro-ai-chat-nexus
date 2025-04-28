import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/message';

interface ChatState {
  threadId: string;
  chatHistory: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  updateLastAssistantMessage: (content: string) => void;
}

const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      threadId: '',
      chatHistory: [],
      isLoading: false,
      addMessage: (message) => {
        set((state) => ({
          chatHistory: [...state.chatHistory, message]
        }));
      },
      setLoading: (loading) => set({ isLoading: loading }),
      clearMessages: () => {
        console.log('clear messages');
        set({ chatHistory: [] });
      },
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
    }),
    {
      name: 'chat-storage', // unique name
      partialize: (state) => ({
        threadId: state.threadId,
        chatHistory: state.chatHistory,
        isLoading: state.isLoading
      })
    }
  )
);

export default useChatStore;
