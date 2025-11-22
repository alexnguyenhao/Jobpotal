import axios from "axios";
import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
import { useDispatch } from "react-redux";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  removeNotification,
} from "@/redux/notificationSlice";
import { toast } from "sonner";

const useNotificationActions = () => {
  const dispatch = useDispatch();

  // 1. Mark All as Read
  const readAll = async () => {
    try {
      const res = await axios.put(
        `${NOTIFICATION_API_END_POINT}/read-all`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(markAllNotificationsAsRead());
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update notifications");
    }
  };

  // 2. Mark Single as Read
  const readById = async (id) => {
    try {
      // Assuming your backend expects { id: ... } in the body based on your previous code
      const res = await axios.put(
        `${NOTIFICATION_API_END_POINT}/read`,
        { id },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(markNotificationAsRead(id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 3. Delete Notification
  const deleteNotice = async (id) => {
    try {
      const res = await axios.delete(
        `${NOTIFICATION_API_END_POINT}/delete/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(removeNotification(id));
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete notification");
    }
  };

  return { readAll, readById, deleteNotice };
};

export default useNotificationActions;