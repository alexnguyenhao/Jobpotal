import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Message = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedConversation } = useSelector((state) => state.conversation);

  const fromMe = message.senderId === user?._id;
  const chatClassName = fromMe ? "justify-end" : "justify-start";
  const bubbleColor = fromMe
    ? "bg-[#6A38C2] text-white"
    : "bg-gray-200 text-gray-800";
  const profilePic = fromMe
    ? user?.profilePhoto
    : selectedConversation?.profilePhoto;

  // Format time (Helper function)
  const extractTime = (dateString) => {
    const date = new Date(dateString);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
  };
  const padZero = (number) => {
    return number.toString().padStart(2, "0");
  };

  const formattedTime = extractTime(message.createdAt);

  return (
    <div className={`flex gap-2 items-end mb-4 ${chatClassName}`}>
      {!fromMe && (
        <Avatar className="w-8 h-8 mb-1">
          <AvatarImage src={profilePic} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col max-w-[70%]">
        <div
          className={`px-4 py-2 rounded-2xl ${bubbleColor} break-words text-sm`}
        >
          {message.message}
        </div>
        <div
          className={`text-[10px] text-gray-400 mt-1 ${
            fromMe ? "text-right" : "text-left"
          }`}
        >
          {formattedTime}
        </div>
      </div>

      {fromMe && (
        <Avatar className="w-8 h-8 mb-1">
          <AvatarImage src={profilePic} />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Message;
