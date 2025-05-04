import { useState, useRef, useEffect } from 'react';
import {
  Send
  // RefreshCw
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import useXaiChatHistory from '@/hooks/useXaiChatHistory';
import { ChatContainer } from './ChatContainer';
import useChatStore from '@/store/useChatStore';
import { createGameFilesApi } from '@/api/commonApi';
import useCurrentGameState from '@/store/useCurrentGameState';

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const gameRelatedQuestions = [
  'What game can we create for you today?',
  'How can we level up your gaming experience?',
  'What kind of game are you dreaming of?',
  'Ready to play? Let’s build your game!',
  'What’s your next gaming adventure?',
  'How can we bring your game ideas to life?',
  'What game concept can we help you develop?',
  'What’s your vision for the perfect game?',
  'How can we make your game idea a reality?',
  'What game features are you looking for?'
];

const ChatInterface = () => {
  const [questions, setQuestions] = useState('');
  const {
    chatHistory,
    // setChatHistory,
    xaiMessageStream,
    isLoading,
    inputValue,
    prompted,
    setInputValue,
    imageBubbleArray
  } = useXaiChatHistory();

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { clearMessages } = useChatStore();
  const { currentGameId } = useCurrentGameState();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Function to resize textarea based on content
  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '40px'; // Reset height to calculate correctly
      const scrollHeight = textarea.scrollHeight;
      // Limit height to approximately 2 rows (~60px)
      textarea.style.height = `${Math.min(scrollHeight, 60)}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [inputValue]);

  useEffect(() => {
    setQuestions(
      gameRelatedQuestions[
        Math.floor(Math.random() * gameRelatedQuestions.length)
      ]
    );
    // deleteGame(address);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      xaiMessageStream();
    }
  };
  console.log('questions', questions);
  console.log('chatHistory', chatHistory);
  return (
    <div className='flex-1 flex flex-col max-w-[52vw] min-w-[320px] mx-auto'>
      {/* Chat messages */}
      {chatHistory.length === 0 || chatHistory[0].role === 'assistant' ? (
        <div className='flex-1 p-4'>
          <p className='flex justify-center items-center h-full text-center text-gray-500 text-xl'>
            {questions}
          </p>
        </div>
      ) : (
        <ChatContainer
          messages={chatHistory}
          isLoading={isLoading}
          // imageBubbleArray={imageBubbleArray}
          // setChatHistory={setChatHistory}
          // messageCount={messageCount}
          chatEndRef={chatEndRef}
        />
      )}

      {/* Input area */}
      <div className='p-4'>
        <div className='relative flex items-center'>
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder='Type your message...'
            className='retro-input w-full pr-10 resize-none min-h-[40px] max-h-[60px] overflow-auto'
            style={{ height: '40px' }}
          />
          <button
            onClick={xaiMessageStream}
            disabled={inputValue.trim() === ''}
            className='absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neoplay-green hover:text-neoplay-darkGreen disabled:opacity-50'>
            <Send size={20} />
          </button>
        </div>
        {/* <button
          onClick={() => createGameFilesApi(currentGameId)}
          className='absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neoplay-green hover:text-neoplay-darkGreen disabled:opacity-50'>
          <RefreshCw size={20} />
        </button> */}
      </div>
    </div>
  );
};

export default ChatInterface;
