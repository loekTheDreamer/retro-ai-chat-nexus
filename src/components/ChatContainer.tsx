import React from 'react';

import { Message } from '@/types/message';
import { AgentBubble } from './AgentBubble';

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
  // setChatHistory: (
  //   newHistory: Message[] | ((prev: Message[]) => Message[])
  // ) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  // setChatHistory,
  chatEndRef
}) => {
  // console.log('isloading', isLoading);
  return (
    <div className='flex-1 overflow-y-auto p-6 chat-container space-y-4'>
      {messages.map((msg) => (
        <div
          key={msg.id} // <-- This is the correct place!
          className={`flex ${
            msg.role === 'user' ? 'justify-end' : 'justify-start w-full'
          }`}>
          <div
            className={`px-4 py-2 rounded-sm ${
              msg.role === 'user'
                ? 'bg-neoplay-gray text-white max-w-[80%] pb-1'
                : 'bg-neoplay-darkGreen bg-opacity-20 border border-neoplay-green text-neoplay-green w-full'
            }`}>
            <div className='whitespace-pre-wrap'>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <AgentBubble
                  content={msg.content}
                  // setChatHistory={setChatHistory}
                  messageCount={0}
                />
              )}
            </div>

            <div className='text-xs text-gray-400 mt-1'></div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className='flex justify-start w-full' aria-label='Loading'>
          <svg
            className='animate-spin h-5 w-5 neoplay-green'
            style={{ animationDuration: '0.3s' }}
            viewBox='0 0 48 48'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <rect
              x='8'
              y='8'
              width='32'
              height='32'
              stroke='currentColor'
              strokeWidth='4'
              fill='none'
            />
          </svg>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};
