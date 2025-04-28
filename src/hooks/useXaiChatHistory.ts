import { Message } from '@/types/message';
import { xaiStreamEvent } from '@/api/xai';
import useChatStore from '@/store/useChatStore';
import useCurrentGameState from '@/store/useCurrentGameState';
// import useErrorDetectedStore from '@/store/useErrorDetectedStore';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { v4 as uuidv4 } from 'uuid';

const useXaiChatHistory = () => {
  //   const [chatHistory, setChatHistory] = useState<Message[]>([]);
  // const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [imageBubbleArray, setImageBubbleArray] = useState<[]>([]);

  const { address } = useAccount();
  const [inputValue, setInputValue] = useState('');
  const [prompted, setPrompted] = useState(false);

  const {
    isLoading,
    setLoading,
    chatHistory,
    addMessage,
    updateLastAssistantMessage
  } = useChatStore();
  const { saveFilesToDisk } = useCurrentGameState();

  // const { setError } = useErrorDetectedStore();

  const xaiMessageStream = () => {
    const input = inputValue.trim();
    if (!input) return;
    // setError(undefined);

    // setPrompted(true);
    const newUserMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input
    };

    addMessage(newUserMessage);

    // setChatHistory((prev) => [
    //   ...prev,
    //   {
    //     role: 'user',
    //     content: input
    //   }
    // ]);
    // setImageBubbleArray((prev) => [...prev, null]);
    setInputValue('');
    setPrompted(true);
    setLoading(true);

    try {
      let accumulatedContent = '';
      xaiStreamEvent({
        chatHistory: chatHistory.concat(newUserMessage),
        // systemPrompt: claudeGameSystemPrompt,
        onMessage: (content) => {
          accumulatedContent += content;
          const { chatHistory: latestChatHistory } = useChatStore.getState();

          // Use updateLastAssistantMessage if last is assistant, else addMessage
          if (
            latestChatHistory.length > 0 &&
            latestChatHistory[latestChatHistory.length - 1].role === 'assistant'
          ) {
            updateLastAssistantMessage(accumulatedContent);
          } else {
            addMessage({
              id: uuidv4(),
              role: 'assistant',
              content: accumulatedContent
            });
          }
        },
        onDone: () => {
          console.log('final content:', accumulatedContent);
          // const code = parseHtmlFullContent(accumulatedContent);
          // if (code) {
          //   setHtmlContent(code);
          // }

          if (!address) {
            console.error('No address provided');
            return;
          }
          console.log('address:', address);
          saveFilesToDisk(address);

          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error in anthropicMessageChat:', error);
    } finally {
      setLoading(false);
    }
  };
  return {
    chatHistory,
    // setChatHistory,
    xaiMessageStream,
    isLoading,
    inputValue,
    prompted,
    setInputValue,
    imageBubbleArray
  };
};

export default useXaiChatHistory;
