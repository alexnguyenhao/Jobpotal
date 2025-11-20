import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setNotifications } from "@/redux/notificationSlice";
import { NOTIFICATION_API_END_POINT } from "@/utils/constant.js";

const useGetAllNotification = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${NOTIFICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setNotifications(res.data.notifications));
        }
      } catch (error) {
        console.log("Failed to fetch notifications:", error);
      }
    };

    // Chỉ gọi API khi user đã đăng nhập
    if (user) {
      fetchNotifications();
    }
  }, [user, dispatch]);
};

export default useGetAllNotification;
