
import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

interface Game {
  id: string;
  name: string;
  threads: Thread[];
}

interface Thread {
  id: string;
  name: string;
}

interface LeftPanelProps {
  isOpen: boolean;
}

const LeftPanel = ({ isOpen }: LeftPanelProps) => {
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      name: "RETRO DUNGEON",
      threads: [
        { id: "1-1", name: "Level Design" },
        { id: "1-2", name: "Enemy AI" },
        { id: "1-3", name: "Loot System" },
      ],
    },
    {
      id: "2",
      name: "SPACE SHOOTER",
      threads: [
        { id: "2-1", name: "Ship Controls" },
        { id: "2-2", name: "Weapon Systems" },
      ],
    },
    {
      id: "3",
      name: "PIXEL PLATFORMER",
      threads: [
        { id: "3-1", name: "Character Animation" },
        { id: "3-2", name: "Level Generation" },
      ],
    },
  ]);
  
  const [expandedGames, setExpandedGames] = useState<Record<string, boolean>>({
    "1": true,
    "2": false,
    "3": false,
  });

  const toggleGameExpand = (gameId: string) => {
    setExpandedGames((prev) => ({
      ...prev,
      [gameId]: !prev[gameId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={`w-64 border-r-2 border-neoplay-green overflow-y-auto animate-slide-in-left`}>
      <div className="p-4">
        <h2 className="font-pixel text-sm mb-4">GAME PROJECTS</h2>
        
        <div className="space-y-2">
          {games.map((game) => (
            <div key={game.id} className="border border-neoplay-green">
              <button
                onClick={() => toggleGameExpand(game.id)}
                className="flex items-center justify-between w-full p-2 hover:bg-neoplay-gray text-left"
              >
                <span className="font-mono text-sm truncate">{game.name}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    expandedGames[game.id] ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              
              {expandedGames[game.id] && (
                <div className="pl-4 border-t border-neoplay-green">
                  {game.threads.map((thread) => (
                    <button
                      key={thread.id}
                      className="w-full text-left p-2 text-xs hover:bg-neoplay-gray border-b border-neoplay-green last:border-b-0"
                    >
                      {thread.name}
                    </button>
                  ))}
                  <button className="w-full text-left p-2 text-xs text-neoplay-darkGreen hover:bg-neoplay-gray flex items-center">
                    <Plus size={12} className="mr-1" />
                    <span>NEW THREAD</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button className="retro-btn w-full mt-4 text-sm py-1 flex items-center justify-center">
          <Plus size={16} className="mr-1" />
          <span>NEW GAME PROJECT</span>
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;
