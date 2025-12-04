import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/conversationSlice";
import { toast } from "sonner";
import { CHAT_API_END_POINT } from "@/utils/constant";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${CHAT_API_END_POINT}/${selectedConversation._id}`,
          {
            params: {
              jobId: selectedConversation.jobId,
              applicationId: selectedConversation.applicationId,
            },
            withCredentials: true,
          }
        );

        if (res.data.error) throw new Error(res.data.error);

        dispatch(setMessages(res.data));
      } catch (error) {
        dispatch(setMessages([]));
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [
    selectedConversation?._id,
    selectedConversation?.jobId,
    selectedConversation?.applicationId,
    dispatch,
  ]);

  return { loading };
};

export default useGetMessages;
