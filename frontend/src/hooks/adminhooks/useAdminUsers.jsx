import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import {
  setUsers,
  removeUserInStore,
  updateUserInStore,
} from "@/redux/adminSlice";
import { toast } from "sonner";

const useAdminUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((store) => store.admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ADMIN_API_END_POINT}/all-users`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [dispatch]);

  const deleteUser = async (userId) => {
    try {
      const res = await axios.delete(`${ADMIN_API_END_POINT}/user/${userId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(removeUserInStore(userId));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };
  const updateStatusUser = async (userId, newStatus) => {
    try {
      const res = await axios.put(
        `${ADMIN_API_END_POINT}/update-status-user/${userId}`,
        { newStatus: newStatus },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateUserInStore(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };
  return { users, loading, deleteUser, updateStatusUser };
};

export default useAdminUsers;
