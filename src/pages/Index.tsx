import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import WalletModal from '@/components/WalletModal';

import { useAccount, useSignMessage } from 'wagmi';
import { disconnect } from '@wagmi/core';

import { authNonce, authLogin } from '@/api/db';
import useAuthStore from '@/store/useAuthStore';
import { config } from '@/components/WalletConnector/config';

const Index = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const { token, setAuth } = useAuthStore();

  const { isConnected, address } = useAccount();
  const [loginStatus, setLoginStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [responseCode, setResponseCode] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { signMessageAsync } = useSignMessage();
  // const { disconnect } = useDisconnect();

  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (token) {
      navigate('/chat');
    }
  }, [token, navigate]);

  useEffect(() => {
    const loginWithWallet = async (walletAddress: string) => {
      setLoginStatus('loading');
      setErrorMsg(null);
      try {
        const response = await authNonce(walletAddress);
        console.log('auth again:');
        const { message } = response;
        if (!message) {
          setLoginStatus('error');
          setErrorMsg('Could not get nonce from server.');
          return;
        }
        // Sign the nonce
        const signature = await signMessageAsync({
          account: walletAddress as `0x${string}`,
          message: message
        });
        // Send address and signature to backend
        const { token: jwtToken, address: returnedAddress } = await authLogin({
          address: walletAddress,
          signature
        });
        if (!jwtToken || !returnedAddress) {
          throw new Error('Login failed.');
        }

        setAuth(jwtToken, returnedAddress);
        await disconnect(config);

        // setResponseCode(code);
        // if (code === 200) {
        //   setIsConnecting(false);
        //   setLoginStatus('success');
        //   navigate('/chat');
        // } else {
        //   throw new Error('Login failed.');
        // }
      } catch (err) {
        // If the session is corrupted, clean up and force reconnect
        if (
          err &&
          typeof err === 'object' &&
          'message' in err &&
          (err as Error).message.includes('getChainId is not a function')
        ) {
          await disconnect(config);

          setLoginStatus('idle');
          setResponseCode(null);
          setErrorMsg('Your wallet session was corrupted. Please reconnect.');
          hasLoggedIn.current = false;
          return;
        }
        // Generic error: disconnect and show error UI
        setLoginStatus('error');
        setErrorMsg((err as Error).message || 'Error logging in.');

        hasLoggedIn.current = false;
      }
    };

    // Only try to login if connected and not already attempted
    if (
      isConnected &&
      address &&
      loginStatus === 'idle' &&
      !hasLoggedIn.current
    ) {
      hasLoggedIn.current = true;
      toast.success('Address connected...');
      loginWithWallet(address);
    }
  }, [isConnected, address, signMessageAsync, loginStatus, navigate, setAuth]);

  const handleConnect = () => {
    setIsWalletModalOpen(true);
  };

  const handleWalletSelect = (wallet: string) => {
    setIsConnecting(true);
    setIsWalletModalOpen(false);
    // // Simulate connecting to selected wallet
    // setTimeout(() => {
    //   setIsConnecting(false);
    //   toast.success(`${wallet} connected successfully!`);
    //   navigate('/chat');
    // }, 1500);
  };

  useEffect(() => {
    if (!isConnected) {
      setIsConnecting(false);
      setLoginStatus('idle');
    }
  }, [isConnected]);

  useEffect(() => {
    console.log('loginStatus:', loginStatus);
    if (loginStatus === 'loading') {
      setIsConnecting(true);
      setIsWalletModalOpen(false);
    }
  }, [loginStatus, navigate]);

  useEffect(() => {
    console.log('errorMsg:', errorMsg);

    const refresh = async () => {
      setIsConnecting(false);
      setLoginStatus('idle');
      setIsConnecting(false);
      setLoginStatus('error');
      setIsWalletModalOpen(false);
      toast.error(errorMsg);
      await disconnect(config);
    };
    if (errorMsg) {
      refresh();
    }
  }, [errorMsg]);
  // if (loginStatus === 'loading') return <div>Logging in...</div>;
  // if (loginStatus === 'error' || responseCode !== 200)
  //   return (
  //     <div
  //       style={{
  //         minHeight: '60vh',
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //         justifyContent: 'center'
  //       }}>
  //       <button
  //         onClick={async () => {
  //           await disconnect();
  //           Object.keys(localStorage).forEach((key) => {
  //             if (key.startsWith('walletconnect')) localStorage.removeItem(key);
  //           });
  //           window.location.reload();
  //         }}
  //         style={{
  //           padding: '14px 32px',
  //           background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
  //           color: '#fff',
  //           fontWeight: 'bold',
  //           fontSize: '1.1rem',
  //           border: 'none',
  //           borderRadius: '8px',
  //           boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  //           cursor: 'pointer',
  //           marginBottom: '22px',
  //           transition: 'background 0.2s, transform 0.2s'
  //         }}
  //         onMouseOver={(e) =>
  //           (e.currentTarget.style.background =
  //             'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)')
  //         }
  //         onMouseOut={(e) =>
  //           (e.currentTarget.style.background =
  //             'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)')
  //         }>
  //         &#x21bb; Reset Wallet
  //       </button>
  //       {errorMsg && (
  //         <div
  //           style={{
  //             color: '#fff',
  //             background: 'rgba(252,92,125,0.9)',
  //             padding: '14px 28px',
  //             borderRadius: '8px',
  //             fontWeight: 'bold',
  //             fontSize: '1.1rem',
  //             boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  //             marginTop: 8,
  //             textAlign: 'center',
  //             maxWidth: 400
  //           }}>
  //           {errorMsg}
  //         </div>
  //       )}
  //     </div>
  //   );
  // if (loginStatus === 'loading') return <div>Logging in...</div>;

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-neoplay-black p-4'>
      <div className='max-w-md w-full space-y-10'>
        {/* Logo */}
        <div className='text-center'>
          <h1 className='font-pixel text-4xl text-neoplay-green animate-text-flicker mb-2'>
            NEOPLAY.FUN
          </h1>
          <p className='font-pixel text-xl text-white mt-4 mb-8'>
            <span className='block'>AGENTIC AI</span>
            <span className='block mt-2'>MEETS</span>
            <span className='block mt-2 text-neoplay-green'>GAMING</span>
          </p>
        </div>

        {/* Login Box */}
        <div className='pixel-borders bg-neoplay-black p-6 space-y-6 animate-pixel-shine'>
          <h2 className='font-pixel text-xl text-center mb-6'>ACCESS PORTAL</h2>

          <div className='space-y-4'>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className='retro-btn w-full flex items-center justify-center'>
              {isConnecting ? 'Sign message...' : 'CONNECT WALLET'}
            </button>

            <div className='text-center text-xs text-neoplay-green mt-4 font-mono'>
              PRIVATE BETA v0.1.1
            </div>
          </div>
        </div>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletSelect={handleWalletSelect}
      />
    </div>
  );
};

export default Index;
