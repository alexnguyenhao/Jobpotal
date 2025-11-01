import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";

import { jobSchema } from "@/lib/jobSchema.js";
import { JOB_API_END_POINT, provinces } from "@/utils/constant.js";

import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Textarea } from "@/components/ui/textarea.js";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.js";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.js";

import { useSelector, useDispatch } from "react-redux";
import { fetchCompanies } from "@/redux/companySlice.js";
import useGetAllCategories from "@/hooks/useGetAllCategoris.jsx";

const PROVINCES = provinces;

const UpdateJob = () => {
  const { id } = useParams(); // Job ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { companies } = useSelector((store) => store.company);
  const { categories } = useSelector((store) => store.category);

  useGetAllCategories();

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      benefits: "",
      salaryMin: "",
      salaryMax: "",
      currency: "VND",
      isNegotiable: false,
      province: "",
      district: "",
      address: "",
      jobType: [],
      experience: "",
      position: 1,
      companyId: "",
      categoryId: "",
      seniorityLevel: "",
      applicationDeadline: "",
    },
  });

  // ✅ Load job details when page opens
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const job = res.data.job;

          // Đổ dữ liệu vào form
          form.reset({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements?.join("\n") || "",
            benefits: job.benefits?.join("\n") || "",
            salaryMin: job.salary?.min || "",
            salaryMax: job.salary?.max || "",
            currency: job.salary?.currency || "VND",
            isNegotiable: job.salary?.isNegotiable || false,
            province: job.location?.province || "",
            district: job.location?.district || "",
            address: job.location?.address || "",
            jobType: job.jobType || [],
            experience: job.experienceLevel || "",
            position: job.numberOfPositions || 1,
            companyId: job.company?._id || "",
            categoryId: job.category?._id || "",
            seniorityLevel: job.seniorityLevel || "",
            applicationDeadline: job.applicationDeadline
              ? job.applicationDeadline.split("T")[0]
              : "",
          });
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load job details");
      } finally {
        setIsFetching(false);
      }
    };
    fetchJob();
  }, [id, form]);

  // ✅ Update handler
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        company: data.companyId,
        category: data.categoryId,
      };

      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("✅ Job updated successfully!");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating job");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading job details...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          onClick={() => navigate("/admin/jobs")}
          variant="outline"
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="text-2xl font-bold text-center mb-6">Update Job</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
          >
            {/* ===== JOB TITLE ===== */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ===== COMPANY & CATEGORY ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                form={form}
                name="companyId"
                label="Company"
                options={companies.map((c) => ({
                  value: c._id,
                  label: c.name,
                }))}
              />
              <SelectField
                form={form}
                name="categoryId"
                label="Category"
                options={categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
              />
            </div>

            {/* ===== LOCATION ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                form={form}
                name="province"
                label="Province"
                options={PROVINCES.map((p) => ({ value: p, label: p }))}
              />
              <InputField form={form} name="district" label="District" />
              <InputField form={form} name="address" label="Address" />
            </div>

            {/* ===== SALARY ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                form={form}
                name="salaryMin"
                label="Min Salary"
                type="number"
              />
              <InputField
                form={form}
                name="salaryMax"
                label="Max Salary"
                type="number"
              />
              <div className="flex items-end gap-3">
                <SelectField
                  form={form}
                  name="currency"
                  label="Currency"
                  options={[
                    { value: "VND", label: "VND" },
                    { value: "USD", label: "USD" },
                  ]}
                />
                <FormField
                  control={form.control}
                  name="isNegotiable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Negotiable</FormLabel>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ===== EXPERIENCE & POSITION ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                form={form}
                name="experience"
                label="Experience"
                placeholder="e.g. 2+ years"
              />
              <InputField
                form={form}
                name="position"
                label="Number of Positions"
                type="number"
              />
            </div>

            {/* ===== JOB TYPE ===== */}
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {[
                      "Full-time",
                      "Part-time",
                      "Remote",
                      "Contract",
                      "Internship",
                    ].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-md"
                      >
                        <input
                          type="checkbox"
                          value={type}
                          checked={field.value.includes(type)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            field.onChange(
                              checked
                                ? [...field.value, type]
                                : field.value.filter((t) => t !== type)
                            );
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ===== SENIORITY & DEADLINE ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                form={form}
                name="seniorityLevel"
                label="Seniority Level"
                options={[
                  "Intern",
                  "Junior",
                  "Mid",
                  "Senior",
                  "Lead",
                  "Manager",
                ].map((lvl) => ({ value: lvl, label: lvl }))}
              />
              <InputField
                form={form}
                name="applicationDeadline"
                label="Application Deadline"
                type="date"
              />
            </div>

            {/* ===== TEXTAREAS ===== */}
            {["description", "requirements", "benefits"].map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{name}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder={`Enter ${name} details...`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Job...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Job
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

// ✅ Reusable Sub Components
const InputField = ({ form, name, label, type = "text", placeholder }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const SelectField = ({ form, name, label, options }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default UpdateJob;
