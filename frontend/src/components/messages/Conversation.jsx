import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDeleteDialog from "@/components/Shared/ConfirmDeleteDialog";
import {
  setSelectedConversation,
  removeConversationFromSidebar,
} from "@/redux/conversationSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocketContext } from "@/context/SocketContext";
import { MoreVertical, Trash2, EyeOff } from "lucide-react";
import axios from "axios";
import { CHAT_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const Conversation = ({ conversation, lastIdx }) => {
  if (!conversation || !conversation._id) return null;

  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { onlineUsers } = useSocketContext();
  const [showMenu, setShowMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHide = async (e) => {
    e.stopPropagation();
    setShowMenu(false);

    try {
      await axios.put(
        `${CHAT_API_END_POINT}/hide/${conversation.conversationId}`,
        {},
        { withCredentials: true }
      );
      dispatch(
        removeConversationFromSidebar(
          conversation.conversationId || conversation._id
        )
      );

      toast.success("Conversation hidden successfully");
    } catch (error) {
      toast.error("Error hiding conversation");
    }
  };
  const confirmDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConversation = async () => {
    try {
      await axios.delete(
        `${CHAT_API_END_POINT}/delete/${conversation.conversationId}`,
        { withCredentials: true }
      );
      dispatch(removeConversationFromSidebar(conversation.conversationId));
      toast.success("Conversation deleted successfully");
    } catch (error) {
      toast.error("Error deleting conversation");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <div
        className={`group relative flex gap-3 items-center p-3 cursor-pointer transition-colors hover:bg-gray-50
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

        {/* --- NÚT MENU --- */}
        <div
          className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity"
          ref={menuRef}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
          >
            <MoreVertical size={16} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
              <button
                onClick={handleHide}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <EyeOff size={14} /> Hide
              </button>
              <button
                onClick={confirmDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {!lastIdx && <div className="ml-16 mr-4 h-px bg-gray-50" />}

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConversation}
        title="Delete Conversation"
        message="Do you want to delete this conversation?"
      />
    </>
  );
};

export default Conversation;
