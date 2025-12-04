import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  addMessage,
  updateSidebarOnNewMessage,
} from "@/redux/conversationSlice";
import { toast } from "sonner";
import { CHAT_API_END_POINT } from "@/utils/constant";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.auth);

  const sendMessage = async (message) => {
    if (!selectedConversation) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${CHAT_API_END_POINT}/send/${selectedConversation._id}`,
        {
          message,
          jobId: selectedConversation.jobId,
          applicationId: selectedConversation.applicationId,
        },
        { withCredentials: true }
      );

      if (res.data.error) throw new Error(res.data.error);

      const newMessage = res.data;

      dispatch(addMessage(newMessage));

      dispatch(
        updateSidebarOnNewMessage({
          newMessage,
          currentUserId: user?._id,
        })
      );
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
