import useAuthStore from '@/store/useAuthStore';
import useCurrentGameState from '@/store/useCurrentGameState';
import { useIframeErrorStore } from '@/store/useIframeErrorStore';

import React, { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

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

  const { tempId } = useCurrentGameState();

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

  // console.log('htmlContent', htmlContent);
  console.log('tempId: ', tempId);
  return (
    <div className='flex flex-col items-center justify-center h-full p-4'>
      <div className='border-2 border-neoplay-green p-2 bg-neoplay-black'>
        <div className='w-600 h-600 bg-neoplay-gray'>
          {tempId > 0 && (
            <iframe
              key={tempId}
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
      <p className='mt-4 text-center text-sm font-mono'>GAME PREVIEW</p>
    </div>
  );
};

export default PreviewTab;
