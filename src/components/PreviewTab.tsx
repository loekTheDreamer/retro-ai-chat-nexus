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
  const containerRef = useRef<HTMLDivElement>(null);

  const { updateId, setScreenshotData, allGameFiles } = useCurrentGameState();

  // const { address } = useAccount();
  const { address } = useAuthStore();
  const [currentGameURL, setCurrentGameURL] = useState<string>();

  const { iframeError, setIframeError } = useIframeErrorStore();

  useEffect(() => {
    if (!address) return;
    const url = `${baseUrl}/currentGame/${address}/index.html`;

    setCurrentGameURL(url);
  }, [address]);

  // Listen for error messages and screenshot data from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'iframe-error') {
        const { msg, url, line, col } = event.data;
        setIframeError({ msg, url, line, col });
        console.log('Received iframe error:', event.data);
      }
      if (event.data?.type === 'screenshot-data' && event.data.imageData) {
        setScreenshotData(event.data.imageData);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setIframeError, setScreenshotData]);

  // Function to trigger screenshot capture in the iframe
  const captureScreenshot = () => {
    if (containerRef.current) {
      const iframe = containerRef.current.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow?.postMessage({ type: 'capture-screenshot' }, '*');
        console.log('Sent capture-screenshot message to iframe');
      } else {
        console.error('No iframe found in container');
      }
    } else {
      console.error('Container ref is not set');
    }
  };

  useEffect(() => {
    const handleIframeLoad = () => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('load', handleIframeLoad);
      currentContainer.focus();
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const handleScreenshot = () => {
    if (containerRef.current) {
      captureScreenshot();
    }
  };

  // Listen for screenshot data from the iframe
  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'screenshot-data' && event.data.imageData) {
        setScreenshotData(event.data.imageData);
        toast.success('Cover image captured');
        console.log('Received screenshot data from iframe');
      } else if (event.data?.type === 'screenshot-error') {
        toast.error('Failed to capture cover image');
        console.error('Screenshot error:', event.data.error);
      } else {
        console.log('Received unknown message from iframe:', event.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [setScreenshotData]);
  console.log('preview gameFiles', allGameFiles);
  return (
    <div className='flex flex-col items-center justify-center h-full p-4'>
      <div className='border-2 border-neoplay-green p-2 bg-neoplay-black'>
        <div ref={containerRef} className='w-600 h-600 bg-neoplay-gray'>
          {updateId > 0 && allGameFiles.length > 0 && (
            <div>
              <iframe
                key={updateId}
                // src='/anotherClaudeTest.html'
                // src='/testFix.html'
                src={currentGameURL}
                // src={props.src}
                width='600'
                height='600'
                style={{ border: 0, display: 'block' }}
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
      {iframeError && (
        <div className='mt-5 text-red-500 hover:bg-neoplay-green-dark text-black px-4 py-2 rounded'>
          <p>{iframeError.msg}</p>
          <p>at line {iframeError.line}</p>
        </div>
      )}
      {updateId > 0 && allGameFiles.length > 0 && (
        // && iframeError === null
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
