import React, { useEffect, useState } from "react";
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
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const ProfileCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id công ty từ URL
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Gọi API lấy dữ liệu công ty theo ID
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setCompany(res.data.company);
        } else {
          toast.error(res.data.message || "Failed to load company");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch company data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  // 🟡 Hiển thị khi đang tải
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

  // 🟢 Hiển thị thông tin công ty
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Top Bar (Back + Edit) */}
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

        {/* Header Section */}
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
              link
            />
            <InfoRow
              icon={<Facebook />}
              label="Facebook"
              value={company.socials?.facebook}
              link
            />
            <InfoRow icon={<Phone />} label="Phone" value={company.phone} />
            <InfoRow icon={<Mail />} label="Email" value={company.email} />
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

// 🔹 Component tái sử dụng cho từng dòng thông tin
const InfoRow = ({ icon, label, value, link = false }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <p className="text-gray-700">
        <span className="font-medium text-gray-900">{label}: </span>
        {link ? (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
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
