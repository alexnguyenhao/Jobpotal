import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  Trash2,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  MoreHorizontal
} from "lucide-react";

// Hooks
import useNotificationActions from "@/hooks/useNotificationActions";
import useGetAllNotification from "@/hooks/useGetAllNotification";

// UI Components (Giả sử bạn dùng shadcn/ui hoặc tailwind thuần)
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Notifications = () => {
  // 1. Lấy data từ Redux
  const { notifications = [] } = useSelector((state) => state.notification);
  
  // 2. Gọi các actions (API + Redux dispatch)
  const { readAll, readById, deleteNotice } = useNotificationActions();
  
  // 3. Đảm bảo luôn fetch data mới nhất khi vào trang này
  useGetAllNotification();

  // 4. State cho bộ lọc (Filter)
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  // Logic lọc thông báo
  const filteredNotifications = notifications.filter((note) => {
    if (filter === "unread") return !note.isRead;
    return true;
  });

  // Đếm số lượng
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Helper: Format thời gian (VD: "2 giờ trước")
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage all updates about your resume and job.
              </p>
            </div>

            {/* Mark All Read Button */}
            {unreadCount > 0 && (
              <Button
                onClick={readAll}
                variant="outline"
                className="text-[#6A38C2] border-purple-100 hover:bg-purple-50 hover:text-[#5b30a6]"
              >
                <CheckCheck size={16} className="mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* --- TABS FILTER --- */}
          <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === "unread"
                  ? "bg-white text-[#6A38C2] shadow-sm ring-1 ring-purple-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
              >
                Unread
            </button>
          </div>

          {/* --- NOTIFICATION LIST --- */}
          <div className="divide-y divide-gray-100 min-h-[400px]">
            {filteredNotifications.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Don't have notification
                </h3>
                <p className="text-gray-500 mt-1 max-w-sm">
                  {filter === "unread"
                    ? "You have read all notifications"
                    : "When you apply or have updates, notifications will appear here."}
                </p>
              </div>
            ) : (
              // List Items with Animation
              <AnimatePresence initial={false}>
                {filteredNotifications.map((noti) => (
                  <motion.div
                    key={noti._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => !noti.isRead && readById(noti._id)}
                    className={`group relative p-5 flex gap-4 transition-all cursor-pointer hover:bg-gray-50 ${
                      !noti.isRead ? "bg-purple-50/40" : "bg-white"
                    }`}
                  >
                    {/* Icon Type */}
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`p-2 rounded-full shadow-sm ${
                          noti.type === "application_status"
                            ? "bg-blue-100 text-blue-600"
                            : noti.type === "job_alert"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {noti.type === "application_status" ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <AlertCircle size={20} />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-8">
                      <div className="flex items-start justify-between mb-1">
                        <p
                          className={`text-sm sm:text-base leading-snug ${
                            !noti.isRead
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {noti.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center text-xs text-gray-400 font-medium">
                          <Clock size={12} className="mr-1" />
                          {timeAgo(noti.createdAt)}
                        </span>
                        {/* Mobile Delete Button (Visible only on small screens if needed, or keep generic) */}
                      </div>
                    </div>

                    {/* Actions Zone (Right Side) */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Unread Indicator */}
                      {!noti.isRead && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#6A38C2] shadow-sm ring-2 ring-white"></span>
                      )}

                      {/* Delete Button (Visible on Hover) */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotice(noti._id);
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete notification</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
        
        {/* Footer Hint */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>Notifications will be stored for 30 days.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;