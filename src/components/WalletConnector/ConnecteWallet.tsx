import App from '@/App';
import { WalletOptions } from './walletOptions';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { authNonce, authLogin } from '@/api/db';
import { useState, useEffect, useRef } from 'react';

export function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const [loginStatus, setLoginStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [responseCode, setResponseCode] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const hasLoggedIn = useRef(false);
  // useEffect(() => {
  //   disconnect();
  // }, [disconnect]);
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
        const code = await authLogin({ address: walletAddress, signature });
        setResponseCode(code);
        if (code === 200) {
          setLoginStatus('success');
        } else {
          throw new Error('Login failed.');
        }
      } catch (err) {
        // If the session is corrupted, clean up and force reconnect
        if (
          err &&
          typeof err === 'object' &&
          'message' in err &&
          (err as Error).message.includes('getChainId is not a function')
        ) {
          await disconnect();
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('walletconnect')) localStorage.removeItem(key);
          });
          setLoginStatus('idle');
          setResponseCode(null);
          setErrorMsg('Your wallet session was corrupted. Please reconnect.');
          hasLoggedIn.current = false;
          return;
        }
        // Generic error: disconnect and show error UI
        setLoginStatus('error');
        setErrorMsg((err as Error).message || 'Error logging in.');
        await disconnect();
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
      loginWithWallet(address);
    }
  }, [isConnected, address, signMessageAsync, disconnect, loginStatus]);

  // UI rendering logic
  if (loginStatus === 'idle' || !isConnected || !address) {
    // Show wallet connect options and any error message
    return (
      <div>
        {errorMsg && (
          <div style={{ color: 'red', marginTop: 8 }}>{errorMsg}</div>
        )}
        <WalletOptions />
      </div>
    );
  }
  if (loginStatus === 'loading') return <div>Logging in...</div>;
  if (loginStatus === 'error' || responseCode !== 200)
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <button
          onClick={async () => {
            await disconnect();
            Object.keys(localStorage).forEach((key) => {
              if (key.startsWith('walletconnect')) localStorage.removeItem(key);
            });
            window.location.reload();
          }}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            cursor: 'pointer',
            marginBottom: '22px',
            transition: 'background 0.2s, transform 0.2s'
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)')
          }>
          &#x21bb; Reset Wallet
        </button>
        {errorMsg && (
          <div
            style={{
              color: '#fff',
              background: 'rgba(252,92,125,0.9)',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              marginTop: 8,
              textAlign: 'center',
              maxWidth: 400
            }}>
            {errorMsg}
          </div>
        )}
      </div>
    );
  return <App />;
}
