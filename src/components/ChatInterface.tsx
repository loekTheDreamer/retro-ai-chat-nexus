
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  isCode?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "bot",
      content: "Welcome to NEOPLAY! How can I assist you with game development today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to resize textarea based on content
  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px"; // Reset height to calculate correctly
      const scrollHeight = textarea.scrollHeight;
      // Limit height to approximately 2 rows (~60px)
      textarea.style.height = `${Math.min(scrollHeight, 60)}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "user",
      content: input,
      timestamp: new Date(),
      isCode: input.startsWith("```") && input.endsWith("```"),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        {
          content: "Here's an example of a simple game loop:",
          isCode: true,
          codeContent: `function gameLoop() {
  updateGameState();
  renderGame();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();`
        },
        {
          content: "I can help you create a pixel art platformer game. What theme are you thinking of?",
          isCode: false
        },
        {
          content: "Here's a basic sprite class:",
          isCode: true,
          codeContent: `class Sprite {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillStyle = '#4AFF00';
    ctx.fillRect(this.x, this.y, 
      this.width, this.height);
  }
}`
        },
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        sender: "bot",
        content: randomResponse.isCode ? randomResponse.content : randomResponse.content,
        timestamp: new Date(),
        isCode: randomResponse.isCode,
        ...(randomResponse.isCode && { content: randomResponse.codeContent }),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-sm ${
                msg.sender === "user"
                  ? "bg-neoplay-gray text-white"
                  : msg.isCode
                  ? "bg-[#1A1F2C] text-[#C8C8C9] font-mono"
                  : "bg-neoplay-darkGreen bg-opacity-20 border border-neoplay-green text-neoplay-green"
              }`}
            >
              {msg.isCode ? (
                <pre className="whitespace-pre-wrap overflow-x-auto p-2">
                  <code>{msg.content}</code>
                </pre>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t-2 border-neoplay-green p-4">
        <div className="relative flex items-center">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="retro-input w-full pr-10 resize-none min-h-[40px] max-h-[60px] overflow-auto"
            style={{ height: "40px" }}
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === ""}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neoplay-green hover:text-neoplay-darkGreen disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
