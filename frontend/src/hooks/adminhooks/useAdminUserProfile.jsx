import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { setSelectedUser } from "@/redux/adminSlice";
import { toast } from "sonner";

const useAdminUserProfile = (userId) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      dispatch(setSelectedUser(null));
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ADMIN_API_END_POINT}/user/${userId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSelectedUser(res.data.user));
        }
      } catch (error) {
        console.log(error);
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch]);

  return { user: selectedUser, loading };
};

export default useAdminUserProfile;
