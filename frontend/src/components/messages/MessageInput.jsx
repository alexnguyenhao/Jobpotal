import React, { useState } from "react";
import { Send } from "lucide-react";
import useSendMessage from "@/hooks/useSendMessage"; // Hook đã tạo

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form
      className="px-4 py-3 bg-white border-t border-gray-200"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full flex items-center">
        <input
          type="text"
          className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 pr-10 focus:outline-none focus:border-[#6A38C2] focus:ring-1 focus:ring-[#6A38C2] transition-colors"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-0 end-0 flex items-center pe-3 text-[#6A38C2] hover:text-[#5b30a6]"
        >
          {loading ? (
            <div className="w-5 h-5 border-t-2 border-[#6A38C2] rounded-full animate-spin"></div>
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
