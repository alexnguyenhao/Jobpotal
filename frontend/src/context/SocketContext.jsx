import { createContext, useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { toast } from "sonner";
import { addNotification } from "@/redux/notificationSlice"; // Import action redux

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); // Dùng cho chức năng Chat sau này

  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // 1. Khởi tạo kết nối Socket
      const socketInstance = io("http://localhost:8000", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      setSocket(socketInstance);

      // 2. Lắng nghe người dùng Online (cho Chat)
      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // 3. Lắng nghe Thông báo mới (Logic chuyển từ NavBar sang)
      socketInstance.on("newNotification", (notification) => {
        // Hiện toast
        toast.info(notification.message, {
          description: "Bạn có thông báo mới",
        });

        // Lưu vào Redux
        dispatch(addNotification(notification));
      });

      // Cleanup khi unmount hoặc user logout
      return () => {
        socketInstance.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user, dispatch]); // Chạy lại khi user thay đổi

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
