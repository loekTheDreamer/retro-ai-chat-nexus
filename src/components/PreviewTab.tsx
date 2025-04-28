import useAuthStore from '@/store/useAuthStore';
import useCurrentGameState from '@/store/useCurrentGameState';
import { useIframeErrorStore } from '@/store/useIframeErrorStore';

import React, { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

// const baseUrl = import.meta.env.VITE_BASEURL;
// const VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN = import.meta.env
//   .VITE_SEVALLA_BUCKET_PUBLIC_DOMAIN;
const baseUrl = import.meta.env.VITE_BASEURL;

type ErrorState = {
  msg: string;
  url: string;
  line: number;
  col: number;
} | null;

export const PreviewTab: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { updateId, setScreenshotData } = useCurrentGameState();

  // const { address } = useAccount();
  const { address } = useAuthStore();
  const [currentGameURL, setCurrentGameURL] = useState<string>();

  const { iframeError, setIframeError } = useIframeErrorStore();

  useEffect(() => {
    if (!address) return;
    const url = `${baseUrl}/currentGame/${address}/index.html`;

    setCurrentGameURL(url);
  }, [address]);

  // Listen for error messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'iframe-error') {
        const { msg, url, line, col } = event.data;
        // setIframeError({ msg, url, line, col });
        setIframeError({ msg, url, line, col });
        console.log('Received iframe error:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setIframeError]);

  useEffect(() => {
    const handleIframeLoad = () => {
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
      iframeRef.current.focus();
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  const handleClick = () => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  };

  const handleScreenshot = () => {
    if (iframeRef.current) {
      // Send a message to the iframe to request a screenshot
      iframeRef.current.contentWindow?.postMessage(
        { type: 'capture-screenshot' },
        '*'
      );
    }
  };

  // Listen for screenshot data from the iframe
  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      // if (event.data?.type === 'screenshot-data' && event.data.imageData) {
      //   const link = document.createElement('a');
      //   link.download = `game-preview-${updateId}.png`;
      //   link.href = event.data.imageData;
      //   link.click();
      // }
      if (event.data?.type === 'screenshot-data' && event.data.imageData) {
        setScreenshotData(event.data.imageData); // Save to store
        // Optionally, show a toast or UI feedback that screenshot is ready!
        toast.success('Cover image captured');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [updateId, setScreenshotData]);

  return (
    <div className='flex flex-col items-center justify-center h-full p-4'>
      <div className='border-2 border-neoplay-green p-2 bg-neoplay-black'>
        <div className='w-600 h-600 bg-neoplay-gray'>
          {updateId > 0 && (
            <iframe
              key={updateId}
              ref={iframeRef}
              // src='/anotherClaudeTest.html'
              // src='/testFix.html'
              src={currentGameURL}
              // src={props.src}
              width='600'
              height='600'
              style={{ border: 0, display: 'block' }}
              allowFullScreen
            />
          )}
        </div>
      </div>
      {iframeError && (
        <div className='mt-5 text-red-500 hover:bg-neoplay-green-dark text-black px-4 py-2 rounded'>
          <p>{iframeError.msg}</p>
          <p>at line {iframeError.line}</p>
        </div>
      )}
      {updateId > 0 && iframeError === null && (
        <button
          onClick={handleScreenshot}
          className='mt-2 bg-neoplay-green hover:bg-neoplay-green-dark text-black px-4 py-2 rounded'>
          Capture Cover Image
        </button>
      )}
    </div>
  );
};

export default PreviewTab;
