import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setConversations } from "@/redux/conversationSlice";
import { CHAT_API_END_POINT } from "@/utils/constant";

const useGetConversations = () => {
  const [loading, setLoadingLocal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getConversations = async () => {
      setLoadingLocal(true);
      try {
        const res = await axios.get(`${CHAT_API_END_POINT}/conversations`, {
          withCredentials: true,
        });
        if (res.data.error) throw new Error(res.data.error);

        dispatch(setConversations(res.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingLocal(false);
      }
    };

    getConversations();
  }, [dispatch]);

  return { loading };
};

export default useGetConversations;
