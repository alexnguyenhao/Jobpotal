import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "@/redux/conversationSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocketContext } from "@/context/SocketContext";

const Conversation = ({ conversation, lastIdx }) => {
  if (!conversation || !conversation._id) return null;

  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { onlineUsers } = useSocketContext();

  const isSelected =
    selectedConversation?._id === conversation._id &&
    selectedConversation?.jobId === conversation.jobId &&
    selectedConversation?.applicationId === conversation.applicationId;

  const isOnline = onlineUsers.includes(conversation._id);
  const isRecruiter = conversation.role === "recruiter";

  const avatarSrc =
    isRecruiter && conversation.company?.logo
      ? conversation.company.logo
      : conversation.profilePhoto;

  const mainTitle =
    isRecruiter && conversation.lastJobTitle
      ? conversation.lastJobTitle
      : conversation.fullName;

  const subTitle = isRecruiter
    ? conversation.company?.name
    : conversation.lastJobTitle || conversation.role;

  return (
    <>
      <div
        className={`flex gap-3 items-center p-3 cursor-pointer transition-colors hover:bg-gray-50
        ${
          isSelected
            ? "bg-purple-50 border-l-4 border-[#6A38C2]"
            : "border-l-4 border-transparent"
        }
      `}
        onClick={() => dispatch(setSelectedConversation(conversation))}
      >
        <div className="relative flex-shrink-0">
          <Avatar className="w-12 h-12 border border-gray-100 shadow-sm bg-white">
            <AvatarImage src={avatarSrc} className="object-contain p-1" />
            <AvatarFallback className="uppercase font-bold bg-gray-100 text-gray-500">
              {mainTitle?.[0]}
            </AvatarFallback>
          </Avatar>

          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 justify-center">
          <div className="flex justify-between items-center w-full">
            <p className="font-bold text-gray-800 text-sm truncate leading-tight mb-0.5 flex-1">
              {mainTitle}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full shadow-sm">
                {conversation.unreadCount > 99
                  ? "99+"
                  : conversation.unreadCount}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate font-normal uppercase">
            {subTitle}
          </p>
        </div>
      </div>

      {!lastIdx && <div className="ml-16 mr-4 h-px bg-gray-50" />}
    </>
  );
};

export default Conversation;
