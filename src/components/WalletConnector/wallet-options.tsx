import * as React from 'react';
import { Connector, useConnect } from 'wagmi';

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
        //   background: '#f9fafd',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '2rem 0',
          width: '100%',
          maxWidth: 400
        }}>
        <div
          style={{
            fontSize: '1.3rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            color: '#4b4b6b',
            letterSpacing: '0.01em',
            textAlign: 'center'
          }}>
          Connect your wallet to login.
        </div>
        {connectors.map((connector) => (
          <div
            key={connector.uid}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
            <WalletOption
              connector={connector}
              onClick={() => connect({ connector })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletOption({
  connector,
  onClick
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '0.75rem',
        border: 'none',
        background: ready
          ? 'linear-gradient(90deg, #6e8efb 0%, #a777e3 100%)'
          : '#eee',
        color: ready ? '#fff' : '#aaa',
        fontWeight: 500,
        fontSize: '1rem',
        cursor: ready ? 'pointer' : 'not-allowed',
        boxShadow: ready ? '0 2px 8px rgba(110, 142, 251, 0.1)' : 'none',
        transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
        margin: 0,
        outline: 'none'
      }}
      onMouseOver={(e) => {
        if (ready) {
          (e.currentTarget as HTMLButtonElement).style.background =
            'linear-gradient(90deg, #a777e3 0%, #6e8efb 100%)';
        }
      }}
      onMouseOut={(e) => {
        if (ready) {
          (e.currentTarget as HTMLButtonElement).style.background =
            'linear-gradient(90deg, #6e8efb 0%, #a777e3 100%)';
        }
      }}>
      {connector.name}
    </button>
  );
}
