
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, MessageSquare, Code, Eye, ChevronRight, ChevronLeft, User } from "lucide-react";
import { toast } from "sonner";
import ChatInterface from "../components/ChatInterface";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import PublishedGames from "../components/PublishedGames";

const Chat = () => {
  const navigate = useNavigate();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleLeftPanel = () => {
    setLeftPanelOpen(!leftPanelOpen);
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen);
  };

  const toggleGamesView = () => {
    setShowGames(!showGames);
    toast.info(showGames ? "Switched to Chat" : "Switched to Published Games");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col bg-neoplay-black text-neoplay-green overflow-hidden">
      {/* Header */}
      <header className="border-b-2 border-neoplay-green p-4 flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={toggleLeftPanel}
            className="mr-4 hover:text-neoplay-darkGreen"
            aria-label="Toggle left panel"
          >
            {leftPanelOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button className="font-pixel text-xl hover:text-neoplay-darkGreen">
            NEOPLAY
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleGamesView}
            className="retro-btn text-sm py-1 px-3"
          >
            {showGames ? "CHATBOT" : "PUBLISHED GAMES"}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-2 hover:bg-neoplay-gray rounded-md"
              aria-label="User menu"
            >
              <User size={24} className="text-neoplay-green" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 pixel-borders bg-neoplay-black z-50">
                <div className="p-2 border-b border-neoplay-green">
                  <p className="font-mono text-xs truncate">USER: 0x1a2b...3c4d</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-2 hover:bg-neoplay-gray flex items-center"
                >
                  <span className="mr-2">LOGOUT</span>
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleRightPanel}
            className="hover:text-neoplay-darkGreen"
            aria-label="Toggle right panel"
          >
            {rightPanelOpen ? <X size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <LeftPanel isOpen={leftPanelOpen} />

        {/* Main chat area */}
        <main className="flex-1 overflow-hidden">
          {showGames ? <PublishedGames /> : <ChatInterface />}
        </main>

        {/* Right Panel */}
        <RightPanel isOpen={rightPanelOpen} />
      </div>
    </div>
  );
};

export default Chat;
