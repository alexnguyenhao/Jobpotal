import React, { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  setSelectedConversation,
  markMessagesAsReadInStore,
} from "@/redux/conversationSlice";
import axios from "axios";
import { CHAT_API_END_POINT } from "@/utils/constant";

const MessageContainer = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => dispatch(setSelectedConversation(null));
  }, [dispatch]);
  useEffect(() => {
    const markRead = async () => {
      if (
        selectedConversation &&
        selectedConversation.conversationId &&
        selectedConversation.unreadCount > 0
      ) {
        try {
          await axios.post(
            `${CHAT_API_END_POINT}/mark-read/${selectedConversation.conversationId}`,
            {},
            { withCredentials: true }
          );
          dispatch(
            markMessagesAsReadInStore(selectedConversation.conversationId)
          );
        } catch (error) {
          console.error("Mark read failed", error);
        }
      }
    };

    markRead();
  }, [
    selectedConversation?.conversationId,
    selectedConversation?.unreadCount,
    dispatch,
  ]);
  const isRecruiter = selectedConversation?.role === "recruiter";
  const avatarSrc =
    isRecruiter && selectedConversation?.company?.logo
      ? selectedConversation.company.logo
      : selectedConversation?.profilePhoto;
  const displayTitle =
    isRecruiter && selectedConversation?.company?.name
      ? selectedConversation.company.name.toUpperCase()
      : selectedConversation?.fullName;

  let displaySubtitle;

  if (isRecruiter) {
    displaySubtitle = (
      <span className="flex items-center gap-1">
        {selectedConversation?.lastJobTitle && (
          <>
            <span className="font-semibold text-[#6A38C2]">
              {selectedConversation.lastJobTitle}
            </span>
            <span className="text-gray-400">•</span>
          </>
        )}
        <span>{selectedConversation?.fullName}</span>
      </span>
    );
  } else {
    displaySubtitle = (
      <span className="flex items-center gap-1">
        {selectedConversation?.lastJobTitle && (
          <>
            <span className="font-semibold text-[#6A38C2]">
              {selectedConversation.lastJobTitle}
            </span>
            <span className="text-gray-400">•</span>
          </>
        )}
        <span className="capitalize text-gray-500">
          {selectedConversation?.role || "Applicant"}
        </span>
      </span>
    );
  }

  return (
    <div className="md:min-w-[450px] flex flex-col flex-1 h-full">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-gray-200 flex items-center gap-3 shadow-sm sticky top-0 z-10">
            <Avatar className="w-10 h-10 border border-gray-100 bg-white">
              <AvatarImage src={avatarSrc} className="object-contain p-0.5" />
              <AvatarFallback className="uppercase font-bold text-gray-500 bg-gray-100">
                {displayTitle?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col justify-center">
              <span className="text-gray-900 font-bold block leading-tight truncate max-w-[300px]">
                {displayTitle}
              </span>
              <div className="text-xs text-gray-500 mt-0.5">
                {displaySubtitle}
              </div>
            </div>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

const NoChatSelected = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-50/50">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-800 font-semibold flex flex-col items-center gap-2">
        <p>
          Welcome back, <span className="text-[#6A38C2]">{user?.fullName}</span>{" "}
          👋
        </p>
        <p className="text-gray-500 text-base font-normal">
          Select a chat to start messaging
        </p>
        <MessageCircle className="text-3xl md:text-6xl text-center text-[#6A38C2] mt-2" />
      </div>
    </div>
  );
};

export default MessageContainer;
