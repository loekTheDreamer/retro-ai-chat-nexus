import { http, createConfig } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

const projectId = 'f5688f2022e44ce4cf9ce042c16d7a50';

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId })
    // metaMask()
    // safe()
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http()
  }
});
