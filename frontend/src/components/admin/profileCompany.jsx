import React, { useEffect } from "react";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Users,
  Building2,
  Calendar,
  Facebook,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyById,
  getCompanyByIdAdmin,
  resetCompanyState,
} from "@/redux/companySlice";
import { toast } from "sonner";

const ProfileCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // ✅ Lấy user từ Redux
  const { user } = useSelector((state) => state.auth);

  // ✅ Lấy dữ liệu công ty từ Redux
  const {
    singleCompany: company,
    loading,
    error,
  } = useSelector((state) => state.company);

  // 🟢 Fetch data khi component mount
  useEffect(() => {
    if (id) {
      if (user?.role === "recruiter") {
        dispatch(getCompanyByIdAdmin(id));
      } else {
        dispatch(getCompanyById(id));
      }
    }
    return () => dispatch(resetCompanyState());
  }, [dispatch, id, user?.role]);

  // 🔴 Hiển thị lỗi
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // 🟡 Loading
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading company profile...
      </div>
    );

  if (!company)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Company not found
      </div>
    );

  // 🟢 Kiểm tra quyền hiển thị thông tin nội bộ
  const canViewPrivateInfo = user?.role === "recruiter";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Company Profile
            </h1>
          </div>
        </div>

        {/* Logo + Name */}
        <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-8">
          <img
            src={company.logo || "/placeholder-company.png"}
            alt={`${company.name} Logo`}
            className="w-32 h-32 object-contain rounded-lg border shadow-sm"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-500 mt-2">
              {company.industry || "No industry info"}
            </p>

            {canViewPrivateInfo && (
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                {company.isVerified && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    ✅ Verified
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    company.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : company.status === "inactive"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {company.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">About Us</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {company.description || "No description available."}
          </p>
        </div>

        {/* Info Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <InfoRow
              icon={<Building2 />}
              label="Location"
              value={company.location}
            />
            <InfoRow
              icon={<Globe />}
              label="Website"
              value={company.website}
              link="url"
            />
            <InfoRow
              icon={<Facebook />}
              label="Facebook"
              value={company.socials?.facebook}
              link="url"
            />
            <InfoRow
              icon={<Phone />}
              label="Phone"
              value={company.phone}
              link="whatsapp"
            />
            <InfoRow
              icon={<Mail />}
              label="Email"
              value={company.email}
              link="email"
            />
          </div>

          <div className="space-y-4">
            <InfoRow
              icon={<Calendar />}
              label="Founded"
              value={company.foundedYear}
            />
            <InfoRow
              icon={<Users />}
              label="Employee Count"
              value={company.employeeCount || "N/A"}
            />
            <InfoRow
              icon={<MapPin />}
              label="Tags"
              value={company.tags?.join(", ") || "No tags"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
const InfoRow = ({ icon, label, value, link }) => {
  if (!value) return null;

  let href = "#";
  if (link === "url") {
    href = value.startsWith("http") ? value : `https://${value}`;
  } else if (link === "whatsapp") {
    const phoneNumber = value.replace(/\D/g, ""); // chỉ giữ số
    href = `https://wa.me/${phoneNumber}`;
  } else if (link === "email") {
    href = `mailto:${value}`;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <p className="text-gray-700">
        <span className="font-medium text-gray-900">{label}: </span>
        {link ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    </div>
  );
};

export default ProfileCompany;
