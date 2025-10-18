import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import usegetCompanyById from "@/hooks/usegetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { singleCompany } = useSelector((store) => store.company);
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    industry: "",
    foundedYear: "",
    employeeCount: "",
    phone: "",
    email: "",
    socials: { facebook: "" },
    tags: "",
    status: "active",
    isVerified: false,
    file: null,
  });

  // Gọi API để lấy dữ liệu công ty
  usegetCompanyById(params.id);

  // Gán dữ liệu vào form khi API trả về
  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        industry: singleCompany.industry || "",
        foundedYear: singleCompany.foundedYear || "",
        employeeCount: singleCompany.employeeCount || "",
        phone: singleCompany.phone || "",
        email: singleCompany.email || "",
        socials: { facebook: singleCompany.socials?.facebook || "" },
        tags: singleCompany.tags?.join(", ") || "",
        status: singleCompany.status || "active",
        isVerified: singleCompany.isVerified || false,
        file: null,
      });
    }
  }, [singleCompany]);

  // Xử lý thay đổi input
  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "facebook") {
      setInput((prev) => ({
        ...prev,
        socials: { ...prev.socials, facebook: value },
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Xử lý chọn file
  const onFileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput((prev) => ({ ...prev, file }));
  };

  // Xử lý submit form
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();

      Object.entries(input).forEach(([key, value]) => {
        if (key === "file" && value) formData.append("file", value);
        else if (key === "socials")
          formData.append("socials", JSON.stringify(value));
        else if (key === "tags")
          formData.append(
            "tags",
            JSON.stringify(value.split(",").map((t) => t.trim()))
          );
        else formData.append(key, value);
      });

      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Company updated successfully");
      navigate("/admin/companies");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[80px]">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              ✏️ Update Company Information
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="space-y-8">
            {/* Basic Info */}
            <Section title="🏢 Basic Information">
              <InputGroup
                label="Company Name"
                name="name"
                value={input.name}
                onChange={onChangeHandler}
                required
              />
              <TextareaGroup
                label="Description"
                name="description"
                value={input.description}
                onChange={onChangeHandler}
                placeholder="Describe your company..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Industry"
                  name="industry"
                  value={input.industry}
                  onChange={onChangeHandler}
                />
                <InputGroup
                  label="Founded Year"
                  name="foundedYear"
                  type="number"
                  value={input.foundedYear}
                  onChange={onChangeHandler}
                />
              </div>
            </Section>

            {/* Contact Info */}
            <Section title="📞 Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Phone"
                  name="phone"
                  value={input.phone}
                  onChange={onChangeHandler}
                />
                <InputGroup
                  label="Email"
                  name="email"
                  value={input.email}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Website"
                  name="website"
                  value={input.website}
                  onChange={onChangeHandler}
                />
                <InputGroup
                  label="Location"
                  name="location"
                  value={input.location}
                  onChange={onChangeHandler}
                />
              </div>
              <InputGroup
                label="Facebook"
                name="facebook"
                value={input.socials.facebook}
                onChange={onChangeHandler}
              />
            </Section>

            {/* Company Meta */}
            <Section title="📊 Additional Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Employee Count"
                  name="employeeCount"
                  type="number"
                  value={input.employeeCount}
                  onChange={onChangeHandler}
                />
                <InputGroup
                  label="Tags (comma separated)"
                  name="tags"
                  value={input.tags}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Status</Label>
                  <select
                    name="status"
                    value={input.status}
                    onChange={onChangeHandler}
                    className="w-full mt-1 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    id="isVerified"
                    name="isVerified"
                    checked={input.isVerified}
                    onChange={onChangeHandler}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <Label htmlFor="isVerified">Verified Company</Label>
                </div>
              </div>
            </Section>

            {/* Logo */}
            <Section title="🖼 Company Logo">
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:border-blue-400 transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <label
                  htmlFor="file"
                  className="cursor-pointer text-sm text-gray-600 hover:text-blue-600"
                >
                  {input.file
                    ? input.file.name
                    : "Click to upload or drag & drop"}
                </label>
                <Input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={onFileChangeHandler}
                  className="hidden"
                />
              </div>

              {singleCompany?.logo && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={singleCompany.logo}
                    alt="Company Logo"
                    className="h-24 object-contain rounded-md border shadow-sm"
                  />
                </div>
              )}
            </Section>

            {/* Submit */}
            <div className="mt-10">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white text-md py-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Updating...
                  </>
                ) : (
                  "💾 Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// 🔹 Component nhỏ gọn, tái sử dụng
const InputGroup = ({ label, ...props }) => (
  <div>
    <Label htmlFor={props.name}>{label}</Label>
    <Input
      id={props.name}
      {...props}
      className="mt-1 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
    />
  </div>
);

const TextareaGroup = ({ label, ...props }) => (
  <div>
    <Label htmlFor={props.name}>{label}</Label>
    <Textarea
      id={props.name}
      {...props}
      className="mt-1 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
      rows={props.rows || 3}
    />
  </div>
);

const Section = ({ title, children }) => (
  <div className="border-b pb-6 mb-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

export default CompanySetup;
