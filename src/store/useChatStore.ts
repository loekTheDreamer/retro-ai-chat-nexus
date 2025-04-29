import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/message';

interface VariableChatState {
  threadId: string;
  chatHistory: Message[];
  isLoading: boolean;
}
interface ActionsChatState {
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  updateLastAssistantMessage: (content: string) => void;
  setThreadId: (threadId: string) => void;
  setReplaceChatHistory: (chatHistory: Message[]) => void;
  resetChatStore: (threadId: string) => void;
  updateChatStore: (threadId: string, chatHistory: Message[]) => void;
}

const initialState: VariableChatState = {
  threadId: '',
  chatHistory: [],
  isLoading: false
};

const useChatStore = create<VariableChatState & ActionsChatState>()(
  persist(
    (set) => ({
      ...initialState,
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
      },
      setThreadId: (threadId) => set({ threadId }),
      setReplaceChatHistory: (chatHistory) => set({ chatHistory }),
      resetChatStore: (threadId) => {
        console.log('reset store threadId:', threadId);
        set({ ...initialState, threadId });
      },
      updateChatStore: (threadId, chatHistory) => {
        console.log('threadId44', threadId);
        console.log('chatHistory', chatHistory);
        set({ threadId, chatHistory });
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
