import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

// Constants & Redux
import { JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Users,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  CalendarDays,
  CheckCircle2,
  Building2,
  Loader2,
  AlertCircle,
  Map,
  BookOpen,
  GraduationCap,
  Hourglass,
  Layers,
  Pencil,
  Trash2,
  LayoutDashboard,
} from "lucide-react";

import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

// --- HELPERS ---
const formatLocation = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc;
  const { address, ward, district, province } = loc;
  return [district, province].filter(Boolean).join(", "); // Hiển thị ngắn gọn cho Header
};

const getFullAddress = (loc) => {
  if (!loc) return "Remote";
  if (typeof loc === "string") return loc;
  const { address, ward, district, province } = loc;
  return [address, ward, district, province].filter(Boolean).join(", ");
};

const formatSalary = (salary) => {
  if (!salary) return "Thỏa thuận";
  if (typeof salary === "string") return salary;
  const { min, max, currency, isNegotiable } = salary;
  if (isNegotiable) return "Thỏa thuận";
  const fmt = (n) => {
    if (!n) return "0";
    if (n >= 1000000) return `${+(n / 1000000).toFixed(1)} Triệu`;
    if (n >= 1000) return `${+(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };
  const curr = currency === "USD" ? "$" : "";
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${curr}`;
  if (min) return `Từ ${fmt(min)} ${curr}`;
  if (max) return `Lên tới ${fmt(max)} ${curr}`;
  return "Thỏa thuận";
};

const parseStringToArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data
    .split(/\n/)
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

// --- SUB-COMPONENTS ---

// Icon tròn màu xanh/tím giống trong ảnh mẫu
const StatIcon = ({ icon: Icon }) => (
  <div className="w-10 h-10 rounded-full bg-[#6A38C2]/10 flex items-center justify-center text-[#6A38C2] shrink-0">
    <Icon size={20} />
  </div>
);

// Dòng thông tin trong sidebar "Thông tin chung"
const GeneralInfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 mb-4 last:mb-0">
    <StatIcon icon={icon} />
    <div>
      <p className="text-gray-500 text-xs font-medium mb-0.5">{label}</p>
      <p className="text-gray-900 text-sm font-semibold">{value}</p>
    </div>
  </div>
);

// Phần tiêu đề section bên trái
const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-1 h-6 bg-[#6A38C2] rounded-full"></div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
  </div>
);

// --- MAIN COMPONENT ---
const JobDescriptionRecruiter = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (err) {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, dispatch]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Job deleted successfully");
        navigate("/recruiter/jobs");
      }
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-[#6A38C2]" />
      </div>
    );
  }

  if (!singleJob) return null;

  const {
    title,
    description,
    requirements,
    benefits,
    location,
    salary,
    experienceLevel,
    seniorityLevel,
    jobType,
    numberOfPositions,
    applications,
    createdAt,
    applicationDeadline,
    company,
    professional,
  } = singleJob;

  const daysLeft = Math.ceil(
    (new Date(applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysLeft < 0;

  return (
    <div className="min-h-screen bg-[#F3F5F7] pb-10 font-sans">
      {/* --- HEADER SECTION (White Card) --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {title}
              </h1>

              {/* 3 Key Stats Pills (Giống ảnh mẫu: Thu nhập, Địa điểm, Kinh nghiệm) */}
              <div className="flex flex-wrap gap-4 md:gap-8 mb-4">
                <div className="flex items-center gap-3">
                  <StatIcon icon={DollarSign} />
                  <div>
                    <p className="text-gray-500 text-xs">Thu nhập</p>
                    <p className="text-[#6A38C2] font-bold text-base">
                      {formatSalary(salary)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatIcon icon={MapPin} />
                  <div>
                    <p className="text-gray-500 text-xs">Địa điểm</p>
                    <p className="text-gray-900 font-bold text-base">
                      {location?.province || "Hồ Chí Minh"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatIcon icon={Hourglass} />
                  <div>
                    <p className="text-gray-500 text-xs">Kinh nghiệm</p>
                    <p className="text-gray-900 font-bold text-base">
                      {experienceLevel || "Không yêu cầu"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 w-fit px-3 py-1 rounded-md">
                <Clock size={14} />
                <span>
                  Hạn nộp hồ sơ:{" "}
                  <strong>
                    {new Date(applicationDeadline).toLocaleDateString("vi-VN")}
                  </strong>
                </span>
                <span className="text-gray-400">
                  ({isExpired ? "Đã hết hạn" : `Còn ${daysLeft} ngày`})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row md:flex-col gap-3 shrink-0 justify-start md:justify-center min-w-[180px]">
              <Button
                onClick={() => navigate(`/recruiter/jobs/edit/${jobId}`)}
                className="bg-[#6A38C2] hover:bg-[#5b32a8] text-white font-semibold h-11 w-full"
              >
                <Pencil className="w-4 h-4 mr-2" /> Chỉnh sửa tin
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpenDelete(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-11 w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Xóa tin
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/recruiter/jobs/${jobId}/applicants`)}
                className="bg-purple-50 text-[#6A38C2] hover:bg-purple-100 h-11 w-full"
              >
                <Users className="w-4 h-4 mr-2" /> Xem UV (
                {applications?.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY CONTENT (2 Columns) --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Main Details (Chi tiết tin tuyển dụng) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#6A38C2] pl-3">
                    Chi tiết tin tuyển dụng
                  </h2>
                </div>

                {/* Thông tin nhanh dạng Tags */}
                <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-4">
                  {/* Chuyên môn */}
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-gray-700 min-w-[100px] mt-1">
                      Chuyên môn:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(professional) &&
                      professional.length > 0 ? (
                        professional.map((pro, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-normal"
                          >
                            {pro}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          Chưa cập nhật
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Loại công việc */}
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-gray-700 min-w-[100px] mt-1">
                      Hình thức:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {jobType?.map((type, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-normal"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mô tả công việc */}
                <div className="space-y-6">
                  <section>
                    <SectionTitle title="Mô tả công việc" />
                    <div className="text-gray-700 leading-7 text-[15px] whitespace-pre-wrap pl-3">
                      {description}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <SectionTitle title="Yêu cầu ứng viên" />
                    <div className="space-y-2 pl-3">
                      {parseStringToArray(requirements).map((req, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">
                            {req.replace(/^[•\-\*]\s*/, "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <SectionTitle title="Quyền lợi" />
                    <div className="space-y-2 pl-3">
                      {parseStringToArray(benefits).map((ben, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-700 leading-relaxed">
                            {ben.replace(/^[•\-\*]\s*/, "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Sidebar (Thông tin công ty & Thông tin chung) */}
          <div className="space-y-6">
            {/* 1. Company Card */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 rounded-lg border border-gray-100 bg-white">
                    <AvatarImage
                      src={company?.logo}
                      className="object-contain p-1"
                    />
                    <AvatarFallback className="rounded-lg bg-gray-50 text-gray-500 font-bold">
                      {company?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2">
                      {company?.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <Building2 size={12} /> {company?.size || "N/A"} nhân viên
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex gap-2 items-start">
                    <MapPin size={14} className="mt-1 text-gray-400 shrink-0" />
                    <span className="line-clamp-3">
                      {getFullAddress(location)}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center text-[#6A38C2] font-medium cursor-pointer hover:underline">
                    <LayoutDashboard size={14} />
                    <span>Xem trang công ty</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. General Info Card (Thông tin chung) */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-gray-900 mb-5 text-base">
                  Thông tin chung
                </h4>

                <GeneralInfoItem
                  icon={Layers}
                  label="Cấp bậc"
                  value={seniorityLevel}
                />
                <GeneralInfoItem
                  icon={GraduationCap}
                  label="Học vấn"
                  value="Không yêu cầu" // Bạn có thể thêm trường này vào DB sau
                />
                <GeneralInfoItem
                  icon={Users}
                  label="Số lượng tuyển"
                  value={`${numberOfPositions} người`}
                />
                <GeneralInfoItem
                  icon={Briefcase}
                  label="Hình thức làm việc"
                  value={Array.isArray(jobType) ? jobType.join(", ") : jobType}
                />
                <GeneralInfoItem
                  icon={BookOpen}
                  label="Kinh nghiệm"
                  value={experienceLevel}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Xóa tin tuyển dụng"
        message="Bạn có chắc chắn muốn xóa tin này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default JobDescriptionRecruiter;
