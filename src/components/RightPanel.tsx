import { useState } from "react";
import { Code, Eye } from "lucide-react";

interface RightPanelProps {
  isOpen: boolean;
}

const RightPanel = ({ isOpen }: RightPanelProps) => {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  
  if (!isOpen) return null;

  const sampleCode = `function createPlayer(x, y) {
  return {
    x: x,
    y: y,
    speed: 5,
    health: 100,
    update() {
      // Movement logic
      if (keys.ArrowLeft) this.x -= this.speed;
      if (keys.ArrowRight) this.x += this.speed;
      if (keys.ArrowUp) this.y -= this.speed;
      if (keys.ArrowDown) this.y += this.speed;
      
      // Keep player within bounds
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    },
    render(ctx) {
      ctx.fillStyle = "#4AFF00";
      ctx.fillRect(this.x, this.y, 32, 32);
    }
  };
}`;

  return (
    <div className={`w-80 border-l-2 border-neoplay-green flex flex-col animate-slide-in-right`}>
      {/* Tabs */}
      <div className="border-b-2 border-neoplay-green flex">
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 p-2 flex items-center justify-center ${
            activeTab === "code" ? "bg-neoplay-green text-neoplay-black" : ""
          }`}
        >
          <Code size={16} className="mr-2" />
          <span>CODE</span>
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 p-2 flex items-center justify-center ${
            activeTab === "preview" ? "bg-neoplay-green text-neoplay-black" : ""
          }`}
        >
          <Eye size={16} className="mr-2" />
          <span>PREVIEW</span>
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "code" && (
          <div className="p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap">{sampleCode}</pre>
          </div>
        )}
        {activeTab === "preview" && (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="border-2 border-neoplay-green p-2 bg-neoplay-black">
              <div className="w-64 h-64 bg-neoplay-gray relative">
                <div className="absolute w-8 h-8 bg-neoplay-green left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-mono">GAME PREVIEW</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
