import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice"; // Import action set user của bạn
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner"; // Hoặc library toast bạn đang dùng
import { Loader2 } from "lucide-react"; // Icon loading

const AdminLogin = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // dispatch(setLoading(true)); // Nếu bạn có action loading

      const res = await axios.post(`${ADMIN_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // QUAN TRỌNG: Để nhận Cookie từ Backend
      });

      if (res.data.success) {
        // Lưu thông tin admin vào Redux (giống hệt lưu User)
        dispatch(setUser(res.data.user));
        navigate("/admin/dashboard");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      // dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Đăng nhập để quản lý hệ thống
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="admin@gmail.com"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="********"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
            disabled={loading} // Disable khi đang gọi API
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mx-auto animate-spin" />
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
