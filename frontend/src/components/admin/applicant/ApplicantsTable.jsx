import React, { useState } from "react";
import { Link } from "react-router-dom";
import useUpdateApplication from "@/hooks/useUpdateApplication.jsx";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

// UI Components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Icons
import {
  MoreHorizontal,
  Check,
  X,
  FileText,
  User,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Bot,
  Sparkles,
  Loader2,
  ScanSearch, // Icon mới cho action scan
} from "lucide-react";

// --- COMPONENT CON: APPLICANT ROW (Xử lý logic từng dòng) ---
const ApplicantRow = ({ item, statusHandler }) => {
  // State riêng cho từng ứng viên để cập nhật AI real-time
  const [aiData, setAiData] = useState({
    aiScore: item.aiScore,
    aiFeedback: item.aiFeedback,
    matchStatus: item.matchStatus,
  });
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Hàm gọi API khi bấm nút AI Scan
  const handleAnalyze = async () => {
    try {
      setIsLoadingAI(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/analyze/${item._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setAiData(res.data.data); // Cập nhật ngay lập tức không cần F5
        toast.success("AI Analysis completed!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "AI Analysis failed");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Helper render Badge hoặc Nút bấm
  const renderAiBadge = () => {
    // 1. Chưa có điểm -> Hiện nút bấm
    if (aiData.aiScore === null || aiData.aiScore === undefined) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-colors shadow-sm"
          onClick={handleAnalyze}
          disabled={isLoadingAI}
        >
          {isLoadingAI ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Bot className="w-3.5 h-3.5" />
          )}
          {isLoadingAI ? "Scanning..." : "AI Scan"}
        </Button>
      );
    }

    // 2. Đã có điểm -> Hiện Badge kết quả
    let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";
    if (aiData.matchStatus === "High")
      badgeStyle =
        "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
    if (aiData.matchStatus === "Medium")
      badgeStyle =
        "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200";
    if (aiData.matchStatus === "Low")
      badgeStyle = "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block">
            <Badge
              className={`${badgeStyle} border px-2.5 py-0.5 cursor-pointer shadow-sm`}
            >
              {aiData.matchStatus === "High" && (
                <Sparkles className="w-3 h-3 mr-1.5 text-green-600" />
              )}
              {aiData.aiScore}/100 - {aiData.matchStatus}
            </Badge>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0 shadow-xl border-gray-200 rounded-xl overflow-hidden"
          align="start"
        >
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
            <div className="bg-[#6A38C2] p-2 rounded-lg shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                AI Analysis Report
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>
          <div className="p-4 space-y-4 bg-white">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-sm font-semibold text-gray-600">
                Match Score
              </span>
              <span className="text-xl font-bold text-[#6A38C2]">
                {aiData.aiScore}
                <span className="text-sm text-gray-400 font-normal">/100</span>
              </span>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Feedback
              </h5>
              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-sm text-gray-700 leading-relaxed italic">
                "{aiData.aiFeedback}"
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <TableRow className="hover:bg-slate-50/80 transition-colors group border-b border-gray-100">
      {/* 1. CANDIDATE */}
      <TableCell className="py-4 pl-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-200 bg-white shadow-sm">
            <AvatarImage
              src={item?.applicant?.profilePhoto}
              className="object-cover"
            />
            <AvatarFallback className="bg-purple-100 text-[#6A38C2] font-bold">
              {item?.applicant?.fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/recruiter/applicants/resume/${item?.applicant?._id}`}
              className="font-semibold text-gray-900 hover:text-[#6A38C2] transition-colors block"
            >
              {item?.applicant?.fullName || "Unknown Candidate"}
            </Link>
            <span className="text-xs text-gray-400 font-mono">
              ID: {item._id.slice(-6)}
            </span>
          </div>
        </div>
      </TableCell>

      {/* 2. CONTACT */}
      <TableCell>
        <div className="flex flex-col gap-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gray-400" />
            <span
              className="truncate max-w-[140px]"
              title={item?.applicant?.email}
            >
              {item?.applicant?.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            <span>{item?.applicant?.phoneNumber || "N/A"}</span>
          </div>
        </div>
      </TableCell>

      {/* 🔥 3. CỘT AI MATCH (QUAN TRỌNG) */}
      <TableCell>{renderAiBadge()}</TableCell>

      {/* 4. RESUME */}
      <TableCell>
        {item.cv ? (
          <Link
            to={`/cv/view/${item.cv._id}`}
            className="inline-flex items-center gap-1.5 text-[#6A38C2] hover:text-[#5a2ea6] hover:underline font-medium text-sm transition-colors bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100"
          >
            <FileText size={14} /> <span>Online CV</span>
          </Link>
        ) : item?.applicant?.resume ? (
          <a
            href={item?.applicant?.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100"
          >
            <FileText size={14} />
            <span className="truncate max-w-[80px]">
              {item.applicant.resumeOriginalName || "PDF"}
            </span>
          </a>
        ) : (
          <span className="text-gray-400 text-xs italic">No Resume</span>
        )}
      </TableCell>

      {/* 5. COVER LETTER */}
      <TableCell>
        {item.coverLetter ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2 text-gray-600 hover:text-[#6A38C2] hover:bg-purple-50 rounded-lg"
              >
                <MessageSquare size={16} />
                <span className="text-xs font-medium">View</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[#6A38C2]">
                  <MessageSquare className="w-5 h-5" /> Cover Letter
                </DialogTitle>
              </DialogHeader>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto shadow-inner">
                {item.coverLetter}
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <span className="text-gray-400 text-xs italic pl-2">None</span>
        )}
      </TableCell>

      {/* 6. DATE */}
      <TableCell>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={14} />
          {new Date(item.createdAt).toLocaleDateString("en-GB")}
        </div>
      </TableCell>

      {/* 7. STATUS */}
      <TableCell>
        <Badge
          variant="secondary"
          className={`font-medium px-2.5 py-1 rounded-md ${
            item.status === "accepted"
              ? "bg-green-100 text-green-700 border-green-200"
              : item.status === "rejected"
              ? "bg-red-100 text-red-700 border-red-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}
        >
          {item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : "Pending"}
        </Badge>
      </TableCell>

      {/* 8. ACTIONS - Đã thêm hành động AI Scan vào đây */}
      <TableCell className="text-right pr-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1" align="end">
            <div className="space-y-0.5">
              {/* Thêm nút AI Scan vào danh sách hành động */}
              <div
                onClick={handleAnalyze}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-purple-50 text-purple-700 rounded-md cursor-pointer transition-colors font-medium border-b border-gray-100 mb-1"
              >
                {isLoadingAI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ScanSearch className="w-4 h-4" />
                )}
                <span>{isLoadingAI ? "Analyzing..." : "Analyze with AI"}</span>
              </div>

              {["Accepted", "Rejected"].map((status) => (
                <div
                  key={status}
                  onClick={() => statusHandler(status, item?._id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer transition-colors text-gray-700 font-medium"
                >
                  {status === "Accepted" ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <X size={16} className="text-red-600" />
                  )}
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
};

// --- MAIN TABLE COMPONENT ---
const ApplicantsTable = () => {
  const { applicants, statusHandler } = useUpdateApplication();

  if (!applicants?.applications?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200 text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          No applicants yet
        </h3>
        <p className="text-gray-500 max-w-sm mt-1">
          Waiting for candidates to apply for this position.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm bg-white border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/80 border-b border-gray-200">
          <TableRow>
            <TableHead className="w-[280px] py-4 font-semibold text-gray-700 pl-6">
              Candidate
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Contact
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-[150px]">
              AI Match
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Resume / CV
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Cover Letter
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Date Applied
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 pr-6">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.applications.map((item) => (
            <ApplicantRow
              key={item._id}
              item={item}
              statusHandler={statusHandler}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
