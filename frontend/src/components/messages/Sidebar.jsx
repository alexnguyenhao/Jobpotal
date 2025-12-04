import React, { useState } from "react";
import { Search } from "lucide-react";
import Conversation from "./Conversation";
import useGetConversations from "@/hooks/useGetConversations";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { loading } = useGetConversations();
  const { conversations } = useSelector((state) => state.conversation);
  const [searchTerm, setSearchTerm] = useState("");

  // Logic tìm kiếm nâng cao:
  // - Tìm theo tên người
  // - Tìm theo tên công ty
  // - Tìm theo tên job
  const filteredConversations = conversations.filter((c) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = c.fullName?.toLowerCase().includes(term);
    const companyMatch = c.company?.name?.toLowerCase().includes(term);
    const jobMatch = c.lastJobTitle?.toLowerCase().includes(term);

    return nameMatch || companyMatch || jobMatch;
  });

  return (
    <div className="border-r border-slate-200 p-4 flex flex-col w-full md:w-[350px] bg-white h-full">
      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm ứng viên, công ty..."
          className="input input-bordered rounded-full w-full pl-10 pr-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/50 transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
      </div>

      <div className="divider my-0 py-2 border-b border-gray-100"></div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
        {filteredConversations.map((conversation, idx) => {
          // TẠO UNIQUE KEY: Vì 1 user có thể xuất hiện nhiều dòng (nhiều job khác nhau)
          // nên key phải là sự kết hợp của UserID + JobID + AppID
          const uniqueKey = `${conversation._id}_${
            conversation.jobId || "free"
          }_${conversation.applicationId || "free"}`;

          return (
            <Conversation
              key={uniqueKey} // <--- Key mới đảm bảo không bị trùng
              conversation={conversation}
              lastIdx={idx === filteredConversations.length - 1}
            />
          );
        })}

        {loading ? (
          <div className="flex justify-center mt-4">
            <span className="loading loading-spinner text-[#6A38C2]"></span>
          </div>
        ) : null}

        {!loading && filteredConversations.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-4">
            Không tìm thấy cuộc hội thoại nào
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
