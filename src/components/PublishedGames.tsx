
import { useState } from "react";

interface Game {
  id: string;
  title: string;
  description: string;
  author: string;
  plays: number;
}

const PublishedGames = () => {
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      title: "CYBER QUEST",
      description: "A cyberpunk adventure through a neon city.",
      author: "PlayerOne",
      plays: 1243,
    },
    {
      id: "2",
      title: "DUNGEON CRAWLER",
      description: "Explore procedurally generated dungeons filled with monsters and treasures.",
      author: "RetroGamer",
      plays: 876,
    },
    {
      id: "3",
      title: "SPACE COMMANDER",
      description: "Command your fleet in epic space battles.",
      author: "StarExplorer",
      plays: 2134,
    },
    {
      id: "4",
      title: "PIXEL RACER",
      description: "High-speed racing with pixel art aesthetics.",
      author: "SpeedRunner",
      plays: 543,
    },
    {
      id: "5",
      title: "ZOMBIE SURVIVAL",
      description: "Survive waves of zombies in this intense action game.",
      author: "BrainEater",
      plays: 1587,
    },
  ]);

  return (
    <div className="h-full overflow-auto p-6">
      <h1 className="font-pixel text-2xl mb-6">PUBLISHED GAMES</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="border-2 border-neoplay-green p-4 hover:bg-neoplay-gray cursor-pointer transition-colors"
          >
            <h2 className="font-pixel text-lg">{game.title}</h2>
            
            <div className="h-32 bg-neoplay-gray mt-2 flex items-center justify-center">
              <span className="font-pixel text-sm">GAME PREVIEW</span>
            </div>
            
            <p className="mt-3 text-sm">{game.description}</p>
            
            <div className="flex justify-between items-center mt-4 text-xs">
              <span>BY: {game.author}</span>
              <span>PLAYS: {game.plays.toLocaleString()}</span>
            </div>
            
            <button className="retro-btn w-full mt-3 text-sm py-1">PLAY NOW</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublishedGames;
