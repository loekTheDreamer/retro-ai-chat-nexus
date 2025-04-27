import React, { useEffect, useState } from 'react';

import { Message } from '@/types/message';
import { agentMessage } from '@/helpers/agentMessage';
import useCurrentGameState, { GameFiles } from '@/store/useCurrentGameState';
import { AgentBubble } from './AgentBubble';

interface ChatContainerProps {
  messages: Message[];

  isLoading?: boolean;
  // imageBubbleArray: ImageBubbleArray[];
  setChatHistory: (
    newHistory: Message[] | ((prev: Message[]) => Message[])
  ) => void;
  // messageCount: number;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  // imageBubbleArray,
  setChatHistory,
  // messageCount,
  chatEndRef
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 chat-container space-y-4">
      {messages.map((msg) => (
        <div
          className={`flex ${
            msg.role === 'user' ? 'justify-end' : 'justify-start w-full'
          }`}>
          <div
            className={`px-4 py-2 rounded-sm ${
              msg.role === 'user'
                ? 'bg-neoplay-gray text-white max-w-[80%]'
                : 'bg-neoplay-darkGreen bg-opacity-20 border border-neoplay-green text-neoplay-green w-full'
            }`}>
            <p className='whitespace-pre-wrap'>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <AgentBubble
                  content={msg.content}
                  setChatHistory={setChatHistory}
                  messageCount={0}
                />
              )}
              {/* <p className='whitespace-pre-wrap'>{msg.content}</p> */}
            </p>
            <div className='text-xs text-gray-400 mt-1'>
              {/* {msg.timestamp.toLocaleTimeString()} */}
            </div>
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};
