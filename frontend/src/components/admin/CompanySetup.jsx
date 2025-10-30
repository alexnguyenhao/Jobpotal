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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/lib/companySchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const CompanySetup = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { singleCompany } = useSelector((store) => store.company);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Lấy dữ liệu công ty
  usegetCompanyById(params.id);

  // ✅ Setup react-hook-form
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

  // ✅ Load dữ liệu từ store vào form
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
    }
  }, [singleCompany, form]);

  // ✅ Submit form
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
      navigate("/admin/companies");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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

          {/* ✅ Form ShadCN */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Section title="🏢 Basic Information">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your company..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. IT, Education" {...field} />
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
                          <Input type="number" placeholder="2020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Section>

              <Section title="📞 Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+84 123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@domain.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
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
                          <Input placeholder="Ho Chi Minh City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook Page</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/yourpage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title="📊 Additional Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Count</FormLabel>
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
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="startup, innovation, tech"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full mt-1 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="banned">Banned</option>
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isVerified"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 mt-6">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4 border-gray-300 rounded"
                          />
                        </FormControl>
                        <FormLabel>Verified Company</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </Section>

              <Section title="🖼 Company Logo">
                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:border-blue-400 transition">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <label
                            htmlFor="file"
                            className="cursor-pointer text-sm text-gray-600 hover:text-blue-600"
                          >
                            Click to upload or drag & drop
                          </label>
                          <Input
                            type="file"
                            id="file"
                            accept="image/*"
                            onChange={(e) =>
                              form.setValue("file", e.target.files?.[0])
                            }
                            className="hidden"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

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
          </Form>
        </div>
      </div>
    </div>
  );
};

/* ✅ Reusable Section */
const Section = ({ title, children }) => (
  <div className="border-b pb-6 mb-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

export default CompanySetup;
