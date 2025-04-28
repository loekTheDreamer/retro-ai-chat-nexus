import { useState } from 'react';
import { Code, Eye, BookUp } from 'lucide-react';
import PreviewTab from './PreviewTab';
import PublishTab from './PublishTab';

interface RightPanelProps {
  isOpen: boolean;
}

const RightPanel = ({ isOpen }: RightPanelProps) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'publish'>(
    'code'
  );

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
    <div
      className={`w-[620px] border-l-2 border-neoplay-green flex flex-col animate-slide-in-right`}>
      {/* Tabs */}
      <div className='border-b-2 border-neoplay-green flex'>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 p-2 flex items-center justify-center ${
            activeTab === 'code' ? 'bg-neoplay-green text-neoplay-black' : ''
          }`}>
          <Code size={16} className='mr-2' />
          <span>CODE</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 p-2 flex items-center justify-center ${
            activeTab === 'preview' ? 'bg-neoplay-green text-neoplay-black' : ''
          }`}>
          <Eye size={16} className='mr-2' />
          <span>PREVIEW</span>
        </button>
        <button
          onClick={() => setActiveTab('publish')}
          className={`flex-1 p-2 flex items-center justify-center ${
            activeTab === 'publish' ? 'bg-neoplay-green text-neoplay-black' : ''
          }`}>
          <BookUp size={16} className='mr-2' />
          <span>PUBLISH</span>
        </button>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-auto'>
        {activeTab === 'code' && (
          <div className='p-4 font-mono text-sm'>
            <pre className='whitespace-pre-wrap'>{sampleCode}</pre>
          </div>
        )}
        {activeTab === 'preview' && <PreviewTab />}
        {activeTab === 'publish' && <PublishTab />}
      </div>
    </div>
  );
};

export default RightPanel;
