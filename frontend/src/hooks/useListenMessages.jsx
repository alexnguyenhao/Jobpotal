import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocketContext } from "@/context/SocketContext";
import {
  addMessage,
  updateSidebarOnNewMessage,
  setConversations,
} from "@/redux/conversationSlice";
import axios from "axios";
import { CHAT_API_END_POINT } from "@/utils/constant";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

  const { selectedConversation, conversations } = useSelector(
    (state) => state.conversation
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    socket?.on("newMessage", async (newMessage) => {
      const conversationExists = conversations.find(
        (c) =>
          (c.conversationId &&
            c.conversationId === newMessage.conversationId) ||
          (c.jobId && c.jobId === newMessage.job) ||
          (c.applicationId && c.applicationId === newMessage.application) ||
          c._id === newMessage.senderId ||
          c._id === newMessage.receiverId
      );
      if (conversationExists) {
        const isCorrectContext =
          (selectedConversation?.applicationId &&
            selectedConversation.applicationId === newMessage.application) ||
          (selectedConversation?.jobId &&
            selectedConversation.jobId === newMessage.job) ||
          (!newMessage.application &&
            !newMessage.job &&
            (selectedConversation?._id === newMessage.senderId ||
              selectedConversation?._id === newMessage.receiverId));

        const isRelatedUser =
          selectedConversation?._id === newMessage.senderId ||
          selectedConversation?._id === newMessage.receiverId;

        const isOpen = isRelatedUser && isCorrectContext;

        if (isOpen) {
          dispatch(addMessage(newMessage));
          if (newMessage.conversationId) {
            axios
              .post(
                `${CHAT_API_END_POINT}/mark-read/${newMessage.conversationId}`,
                {},
                { withCredentials: true }
              )
              .catch((err) => console.error("Auto mark-read failed", err));
          }
        }

        dispatch(
          updateSidebarOnNewMessage({
            newMessage,
            currentUserId: user?._id,
            isViewed: isOpen,
          })
        );
      } else {
        try {
          const res = await axios.get(`${CHAT_API_END_POINT}/conversations`, {
            withCredentials: true,
          });
          if (res.data) {
            dispatch(setConversations(res.data));
          }
        } catch (error) {
          console.error("Failed to refresh hidden conversation", error);
        }
      }
    });

    return () => socket?.off("newMessage");
  }, [socket, dispatch, selectedConversation, conversations, user]);
};

export default useListenMessages;
