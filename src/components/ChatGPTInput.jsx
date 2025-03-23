import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

const ChatGPTInput = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${API_URL}/api/chatai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.reply);
        setText("");
      } else {
        toast.error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
      toast.error("An error occurred while communicating with ChatGPT");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 w-full">
      {response && (
        <div className="mb-3 p-3 bg-zinc-800 text-white rounded-lg">
          <strong>ChatGPT:</strong> {response}
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Ask ChatGPT..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() || isLoading}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatGPTInput;
