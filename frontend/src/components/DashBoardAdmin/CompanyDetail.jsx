import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAdminCompanyDetail from "@/hooks/adminhooks/useAdminCompanyDetail";
import useAdminCompanies from "@/hooks/adminhooks/useAdminCompanies"; // Import thêm hook để dùng chức năng toggle status
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  Mail,
  Phone,
  Facebook,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  ShieldAlert,
  Hash,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- HELPER COMPONENTS ---
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3 mt-8 first:mt-0">
    <div className="p-2 bg-purple-50 rounded-lg text-[#6A38C2]">
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">
      {title}
    </h2>
  </div>
);

const ContactItem = ({ icon: Icon, label, value, type }) => {
  if (!value) return null;

  let href = "#";
  let displayValue = value;

  if (type === "url") {
    href = value.startsWith("http") ? value : `https://${value}`;
    displayValue = value.replace(/^https?:\/\/(www\.)?/, "");
  } else if (type === "email") {
    href = `mailto:${value}`;
  } else if (type === "phone") {
    href = `tel:${value}`;
  }

  const isLink = type === "url" || type === "email" || type === "phone";

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/50 hover:border-purple-100 transition-colors">
      <div className="p-2 bg-white rounded-full shadow-sm text-gray-500">
        <Icon size={18} />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        {isLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-900 hover:text-[#6A38C2] truncate block transition-colors"
          >
            {displayValue}
          </a>
        ) : (
          <p className="text-sm font-semibold text-gray-900 truncate">
            {displayValue}
          </p>
        )}
      </div>
    </div>
  );
};

const OverviewRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3 text-gray-600">
      <Icon size={16} />
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

// --- MAIN COMPONENT ---
const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company, loading } = useAdminCompanyDetail(id);
  const { toggleCompanyStatus } = useAdminCompanies();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500 bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-[#6A38C2]" />
        <p className="font-medium text-sm">Loading Company Details...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
        <Building2 size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-semibold">Company Not Found</p>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/companies")}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }
  const handleToggleStatus = async () => {
    await toggleCompanyStatus(company._id);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* --- HEADER ACTIONS --- */}
      <div className="max-w-5xl mx-auto px-4 md:px-0 pt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/companies")}
          className="hover:bg-white"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to List
        </Button>

        {/* Admin Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant={company.isVerified ? "destructive" : "default"}
            onClick={handleToggleStatus}
            className={
              !company.isVerified ? "bg-[#6A38C2] hover:bg-[#5b30a6]" : ""
            }
          >
            {company.isVerified ? (
              <>
                <ShieldAlert size={16} className="mr-2" /> Deactivate Company
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="mr-2" /> Approve Company
              </>
            )}
          </Button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-5xl mx-auto mt-6 px-4 md:px-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
          {/* 1. HERO SECTION (Dark) */}
          <div className="bg-slate-900 text-white p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 rounded-2xl border-4 border-white/10 bg-white shadow-xl">
                <AvatarImage src={company.logo} className="object-cover p-1" />
                <AvatarFallback className="rounded-2xl bg-slate-800 text-white font-bold text-3xl">
                  {company.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {company.name}
                  </h1>
                  {company.isVerified ? (
                    <Badge className="bg-green-500/20 text-green-200 hover:bg-green-500/30 border-0 backdrop-blur-md">
                      <CheckCircle2 size={12} className="mr-1" /> Verified
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-200 hover:bg-red-500/30 border-0 backdrop-blur-md">
                      <XCircle size={12} className="mr-1" /> Pending Approval
                    </Badge>
                  )}
                </div>

                <p className="text-slate-400 text-lg font-medium">
                  {company.industry || "Industry Not Specified"}
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {company.location || "N/A"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Hash size={14} /> TaxCode: {company.taxCode || "N/A"}
                  </span>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Globe size={14} /> Website <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. BODY CONTENT */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* LEFT COLUMN (Main Info) - 2/3 */}
              <div className="lg:col-span-2 space-y-10">
                {/* About Us */}
                <section>
                  <SectionHeader title="About Company" icon={Building2} />
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm text-justify">
                    {company.description ||
                      "No description available regarding this company."}
                  </div>
                </section>

                {/* Contact Information (Grid Layout) */}
                <section>
                  <SectionHeader title="Contact Information" icon={Phone} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ContactItem
                      icon={Globe}
                      label="Website"
                      value={company.website}
                      type="url"
                    />
                    <ContactItem
                      icon={Mail}
                      label="Email Address"
                      value={company.email}
                      type="email"
                    />
                    <ContactItem
                      icon={Phone}
                      label="Phone Number"
                      value={company.phone}
                      type="phone"
                    />
                    <ContactItem
                      icon={Facebook}
                      label="Facebook"
                      value={company.socials?.facebook}
                      type="url"
                    />
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN (Sidebar) - 1/3 */}
              <div className="space-y-8">
                {/* Company Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users size={16} className="text-[#6A38C2]" />
                    Overview
                  </h4>
                  <div className="space-y-1">
                    <OverviewRow
                      icon={Calendar}
                      label="Founded"
                      value={company.foundedYear || "N/A"}
                    />
                    <OverviewRow
                      icon={Users}
                      label="Employees"
                      value={
                        company.employeeCount
                          ? `${company.employeeCount}+`
                          : "N/A"
                      }
                    />
                    <OverviewRow
                      icon={MapPin}
                      label="Location"
                      value={company.location || "N/A"}
                    />
                    {/* Admin Only Info */}
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                        System Info
                      </p>
                      <OverviewRow
                        icon={Calendar}
                        label="Created At"
                        value={new Date(company.createdAt).toLocaleDateString()}
                      />
                      <OverviewRow
                        icon={Users}
                        label="Owner ID"
                        value={
                          <span className="font-mono text-xs">
                            {company.userId?._id || company.userId}
                          </span>
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Cloud */}
                {company.tags && company.tags.length > 0 && (
                  <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {company.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-white text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
