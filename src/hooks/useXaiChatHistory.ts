import { Message } from '@/types/message';
import { xaiStreamEvent } from '@/api/xai';
import useChatStore from '@/store/useChatStore';
import useCurrentGameState from '@/store/useCurrentGameState';
// import useErrorDetectedStore from '@/store/useErrorDetectedStore';
import { initialPrompt } from '@/prompts/xaiPrompts';
import { useState } from 'react';
import { useAccount } from 'wagmi';

const useXaiChatHistory = () => {
  //   const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'system', content: initialPrompt }
  ]);
  const [imageBubbleArray, setImageBubbleArray] = useState<[]>([]);

  const { address } = useAccount();

  const [inputValue, setInputValue] = useState('');
  const [prompted, setPrompted] = useState(false);

  const { isLoading, setLoading } = useChatStore();
  const { saveFilesToDisk } = useCurrentGameState();

  // const { setError } = useErrorDetectedStore();

  const xaiMessageStream = () => {
    // console.log('anthropic Message Stream');
    console.log('inputValue: ', inputValue);
    const input = inputValue.trim();
    if (!input) return;
    // setError(undefined);

    // setPrompted(true);
    const newUserMessage: Message = {
      role: 'user',
      content: input
    };

    setChatHistory((prev) => [
      ...prev,
      {
        role: 'user',
        content: input
      }
    ]);
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

          // console.log('accumulatedContent:', accumulatedContent);
          setChatHistory((prev) => {
            const newHistory = [...prev];
            if (newHistory[newHistory.length - 1]?.role === 'assistant') {
              newHistory[newHistory.length - 1].content = accumulatedContent;
            } else {
              newHistory.push({
                role: 'assistant',
                content: accumulatedContent
              });
            }
            return newHistory;
          });
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
      // setLoading(false);
    }
  };
  return {
    chatHistory,
    setChatHistory,
    xaiMessageStream,
    isLoading,
    inputValue,
    prompted,
    setInputValue,
    imageBubbleArray
  };
};

export default useXaiChatHistory;
