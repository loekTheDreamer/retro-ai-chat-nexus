
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate connecting to wallet
    setTimeout(() => {
      setIsConnecting(false);
      toast.success("Wallet connected successfully!");
      navigate('/chat');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neoplay-black p-4">
      <div className="max-w-md w-full space-y-10">
        {/* Logo */}
        <div className="text-center">
          <h1 className="font-pixel text-4xl text-neoplay-green animate-text-flicker mb-2">NEOPLAY.FUN</h1>
          <p className="font-pixel text-xl text-white mt-4 mb-8">
            <span className="block">AGENTIC AI</span>
            <span className="block mt-2">MEETS</span>
            <span className="block mt-2 text-neoplay-green">GAMING</span>
          </p>
        </div>

        {/* Login Box */}
        <div className="pixel-borders bg-neoplay-black p-6 space-y-6 animate-pixel-shine">
          <h2 className="font-pixel text-xl text-center mb-6">ACCESS PORTAL</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="retro-btn w-full flex items-center justify-center"
            >
              {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
            </button>
            
            <div className="text-center text-xs text-neoplay-green mt-4 font-mono">
              PRIVATE BETA v0.1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
