import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks & Constants
import usegetCompanyById from "@/hooks/usegetCompanyById";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { companySchema } from "@/lib/companySchema";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import { ArrowLeft, Loader2, UploadCloud, X, Building2 } from "lucide-react";

const CompanySetup = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { singleCompany } = useSelector((store) => store.company);
  const [isLoading, setIsLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);

  usegetCompanyById(params.id);

  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      location: "",
      industry: "",
      foundedYear: "",
      employeeCount: "",
      phone: "",
      email: "",
      facebook: "",
      tags: "",
      status: "active",
      isVerified: false,
      file: null,
    },
  });

  useEffect(() => {
    if (singleCompany) {
      form.reset({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        industry: singleCompany.industry || "",
        foundedYear: singleCompany.foundedYear?.toString() || "",
        employeeCount: singleCompany.employeeCount?.toString() || "",
        phone: singleCompany.phone || "",
        email: singleCompany.email || "",
        facebook: singleCompany.socials?.facebook || "",
        tags: singleCompany.tags?.join(", ") || "",
        status: singleCompany.status || "active",
        isVerified: singleCompany.isVerified || false,
        file: null,
      });
      setPreviewLogo(singleCompany.logo);
    }
  }, [singleCompany, form]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "file" && value) formData.append("file", value);
        else if (key === "facebook")
          formData.append("socials", JSON.stringify({ facebook: value }));
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
      navigate("/recruiter/companies");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file change to show preview
  const handleFileChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/recruiter/companies")}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Setup</h1>
            <p className="text-sm text-gray-500">
              Manage your company profile and settings.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* --- 1. LOGO UPLOAD --- */}
              <div className="p-8 border-b border-gray-100 bg-gray-50/30">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                  Company Logo
                </h3>
                <div className="flex items-start gap-6">
                  {/* Preview Box */}
                  <div className="h-24 w-24 rounded-xl border bg-white flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                    {previewLogo ? (
                      <img
                        src={previewLogo}
                        alt="Logo"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-gray-300" />
                    )}
                  </div>

                  {/* Upload Area */}
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-purple-400 transition-colors cursor-pointer group">
                            <input
                              {...fieldProps}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, onChange)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="p-2 bg-purple-50 rounded-full mb-2 group-hover:bg-purple-100 transition-colors">
                              <UploadCloud className="h-6 w-6 text-[#6A38C2]" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* --- 2. BASIC INFO --- */}
                <Section title="Basic Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Tech Solutions Inc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your company..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 3. DETAILS --- */}
                <Section title="Company Details">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Software" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="foundedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founded Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2020"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employees</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel>Tags (Comma separated)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="startup, remote, tech..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 4. CONTACT --- */}
                <Section title="Contact Info">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="contact@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Headquarters Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://facebook.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 5. SETTINGS --- */}
                <Section title="Settings" isLast>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>
              </div>

              {/* --- FOOTER ACTION --- */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/recruiter/companies")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#6A38C2] hover:bg-[#5a2ea6] text-white min-w-[150px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

// Helper Section Component
const Section = ({ title, children, isLast }) => (
  <div className={`${!isLast ? "border-b border-gray-100 pb-8" : ""}`}>
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
      {title}
    </h3>
    {children}
  </div>
);

export default CompanySetup;
