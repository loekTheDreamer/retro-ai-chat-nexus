
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "I can help you create a pixel art platformer game. What theme are you thinking of?",
        "You might want to consider adding power-ups to your game for extra excitement.",
        "Your game concept sounds interesting! Let's develop it further.",
        "I can generate some code for your game mechanics. What specifically do you need?",
        "Would you like me to suggest some retro-style sound effects for your game?",
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        sender: "bot",
        content: randomResponse,
        timestamp: new Date(),
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
                  : "bg-neoplay-darkGreen bg-opacity-20 border border-neoplay-green text-neoplay-green"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
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
        <div className="flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="retro-input flex-1 resize-none h-10 min-h-[40px] max-h-[120px] overflow-auto"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === ""}
            className="ml-2 p-2 bg-neoplay-green text-neoplay-black rounded-sm hover:bg-neoplay-darkGreen"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
