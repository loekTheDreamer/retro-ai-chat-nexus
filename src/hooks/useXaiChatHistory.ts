import { Message } from '@/types/message';
import { xaiStreamEvent } from '@/api/xai';
import useChatStore from '@/store/useChatStore';
import useCurrentGameState from '@/store/useCurrentGameState';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const useXaiChatHistory = () => {
  //   const [chatHistory, setChatHistory] = useState<Message[]>([]);
  // const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [imageBubbleArray, setImageBubbleArray] = useState<[]>([]);

  // const { address } = useAccount();`
  const [inputValue, setInputValue] = useState('');
  const [prompted, setPrompted] = useState(false);
  const { token, address } = useAuthStore();

  const navigate = useNavigate();

  const {
    isLoading,
    setLoading,
    chatHistory,
    addMessage,
    updateLastAssistantMessage
  } = useChatStore();
  const { saveFilesToDisk } = useCurrentGameState();

  // const { setError } = useErrorDetectedStore();
  useEffect(() => {
    console.log('chatHistory: ', chatHistory);
    // console.log('chatHistory: ', chatHistory[chatHistory.length - 1].content);
  }, [chatHistory]);

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

      if (chatHistory.length === 0) {
        // input to thread name
      }
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
          setLoading(false);
          // console.log('accumulatedContent:', accumulatedContent);
          // if (!address) {
          //   console.error('No address provided');
          //   toast.error('no address provided');
          //   return;
          // }

          saveFilesToDisk(token, navigate);
        }
      });
    } catch (error) {
      console.error('Error in xaiChat:', error);
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
