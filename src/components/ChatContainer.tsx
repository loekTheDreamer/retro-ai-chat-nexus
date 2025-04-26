import React, { useEffect, useRef, useState } from 'react';
// import { Box } from '@chakra-ui/react';
// import { UserBubble } from './UserBubble';
// import { AgentBubble } from './AgentBubble';
// import { LoadingBubble } from './LoadingBubble';
import { Message } from '@/types/message';
// import { ImageBubble } from './ImageBubble';
// import { ImageBubbleArray } from '../promptSection';

interface ChatContainerProps {
  messages: Message[];

  isLoading?: boolean;
  // imageBubbleArray: ImageBubbleArray[];
  setChatHistory: (
    newHistory: Message[] | ((prev: Message[]) => Message[])
  ) => void;
  // messageCount: number;
  ref: React.RefObject<HTMLDivElement>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  // imageBubbleArray,
  setChatHistory,
  // messageCount,
  ref
}) => {
  // console.log('imageBubbleArray: ', imageBubbleArray);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if (messagesEndRef.current) {
    //   messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    // }
    // if (shouldAutoScroll === false) {
    //   return;
    // }

    if (messagesEndRef.current && shouldAutoScroll) {
      console.log('shouldAutoScroll:', shouldAutoScroll);
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef, shouldAutoScroll]);

  // const scrollToBottom = () => {
  //   // console.log('scrolling...');
  //   if (shouldAutoScroll === false) {
  //     console.log('return');
  //     return;
  //   }
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // useEffect(() => {
  //   setShouldAutoScroll(true);
  // }, [messageCount]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const isNearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  useEffect(() => {
    console.log('shouldAutoScroll: ', shouldAutoScroll);
  }, [shouldAutoScroll]);

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}>
          <div
            className={`max-w-[80%] px-4 py-2 rounded-sm ${
              msg.role === 'user'
                ? 'bg-neoplay-gray text-white'
                : 'bg-neoplay-darkGreen bg-opacity-20 border border-neoplay-green text-neoplay-green'
            }`}>
            <p className='whitespace-pre-wrap'>{msg.content}</p>
            <div className='text-xs text-gray-400 mt-1'>
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
};
