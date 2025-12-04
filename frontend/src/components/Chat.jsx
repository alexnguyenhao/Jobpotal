import React from "react";
import Sidebar from "@/components/messages/Sidebar";
import MessageContainer from "@/components/messages/MessageContainer";
import { useSelector } from "react-redux";

const Chat = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);

  return (
    <div className="relative flex items-center justify-center h-[calc(100vh-65px)] bg-gradient-to-br from-purple-50 via-white to-purple-50 p-2 sm:p-6">
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex w-full max-w-7xl h-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 overflow-hidden">
        <div
          className={`w-full sm:w-[350px] border-r border-gray-100/50 bg-white/50 ${
            selectedConversation ? "hidden sm:block" : "block"
          }`}
        >
          <Sidebar />
        </div>
        <div
          className={`flex-1 flex flex-col ${
            !selectedConversation ? "hidden sm:flex" : "flex"
          }`}
        >
          <MessageContainer />
        </div>
      </div>
    </div>
  );
};

export default Chat;
