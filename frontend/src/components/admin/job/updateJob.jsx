import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

// Store & Utils
import { JOB_API_END_POINT } from "@/utils/constant";
import { jobSchema } from "@/lib/jobSchema";
import useGetAllCategories from "@/hooks/useGetAllCategoris";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import useLocationVN from "@/hooks/useLocationVN";

// Import Data Chuyên môn
import { ProfessionalSpecializations } from "@/data/professionalSpecializations";
import SearchableSelect from "@/components/Shared/SearchableSelect";
// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Loader2, ArrowLeft, X, Search } from "lucide-react";

const UpdateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [loadingJob, setLoadingJob] = useState(true);
  const [specSearch, setSpecSearch] = useState("");

  // Hook Location
  const {
    provinces,
    districts,
    wards,
    loadDistricts,
    loadWards,
    setDistricts,
    setWards,
  } = useLocationVN();

  const { companies } = useSelector((store) => store.company);
  const { categories } = useSelector((store) => store.category);

  useGetAllCategories();
  useGetAllCompanies();

  // Options configuration
  const activeCompanies = companies.map((c) => ({
    label: c.name,
    value: c._id,
  }));

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c._id,
  }));

  const provinceOptions = provinces.map((p) => ({
    label: p.name,
    value: p.name,
  }));
  const districtOptions = districts.map((d) => ({
    label: d.name,
    value: d.name,
  }));
  const wardOptions = wards.map((w) => ({
    label: w.name,
    value: w.name,
  }));

  // --- FORM SETUP ---
  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      professional: [],
      description: "",
      requirements: "",
      benefits: "",
      salaryMin: "",
      salaryMax: "",
      currency: "VND",
      isNegotiable: false,
      location: {
        province: "",
        district: "",
        ward: "",
        address: "",
      },
      jobType: [],
      experienceLevel: "",
      numberOfPositions: 1,
      company: "",
      category: "",
      seniorityLevel: "",
      applicationDeadline: "",
    },
  });

  // --- FETCH JOB DATA ---
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoadingJob(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const job = res.data.job;

          // 1. Reset form values
          form.reset({
            title: job.title,
            professional: job.professional || [],
            description: job.description,
            requirements: Array.isArray(job.requirements)
              ? job.requirements.join("\n")
              : job.requirements,
            benefits: Array.isArray(job.benefits)
              ? job.benefits.join("\n")
              : job.benefits,
            salaryMin: job.salary?.min?.toString() || "",
            salaryMax: job.salary?.max?.toString() || "",
            currency: job.salary?.currency || "VND",
            isNegotiable: job.salary?.isNegotiable || false,
            location: {
              province: job.location?.province || "",
              district: job.location?.district || "",
              ward: job.location?.ward || "",
              address: job.location?.address || "",
            },
            jobType: job.jobType || [],
            experienceLevel: job.experienceLevel || "",
            numberOfPositions: job.numberOfPositions || 1,
            company: job.company?._id || "",
            category: job.category?._id || "",
            seniorityLevel: job.seniorityLevel || "",
            applicationDeadline: job.applicationDeadline
              ? new Date(job.applicationDeadline).toISOString().split("T")[0]
              : "",
          });

          // 2. Load Location Data (FIXED LOGIC)
          // Chúng ta cần đảm bảo Tỉnh được load trước, sau đó mới đến Huyện -> Xã
          if (job.location?.province) {
            // Gọi load districts
            await loadDistricts(job.location.province);

            // Nếu có district, đợi một chút để state districts cập nhật rồi mới load wards
            if (job.location?.district) {
              setTimeout(() => {
                loadWards(job.location.district);
              }, 1000); // Tăng timeout lên 1s để an toàn cho việc fetch API
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load job details");
        navigate("/admin/jobs");
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [id, navigate, form]);

  // --- HANDLERS ---
  const handleProvinceChange = (provinceName) => {
    form.setValue("location.district", "");
    form.setValue("location.ward", "");
    setDistricts([]);
    setWards([]);
    loadDistricts(provinceName);
  };

  const handleDistrictChange = (districtName) => {
    form.setValue("location.ward", "");
    setWards([]);
    loadWards(districtName);
  };

  // --- SUBMIT ---
  const onSubmit = async (data) => {
    try {
      setIsSaving(true);

      const formattedRequirements =
        typeof data.requirements === "string"
          ? data.requirements.split("\n").filter((line) => line.trim() !== "")
          : data.requirements;

      const formattedBenefits =
        typeof data.benefits === "string"
          ? data.benefits.split("\n").filter((line) => line.trim() !== "")
          : data.benefits;

      const payload = {
        ...data,
        salary: {
          min: Number(data.salaryMin),
          max: Number(data.salaryMax),
          currency: data.currency,
          isNegotiable: data.isNegotiable,
        },
        numberOfPositions: Number(data.numberOfPositions),
        requirements: formattedRequirements,
        benefits: formattedBenefits,
        applicationDeadline: new Date(data.applicationDeadline),
      };

      // Cleanup flat fields
      delete payload.salaryMin;
      delete payload.salaryMax;
      delete payload.currency;
      delete payload.isNegotiable;

      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Job updated successfully!");
        navigate("/recruiter/jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error updating job");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSpecializations = ProfessionalSpecializations.filter((item) =>
    item.label.toLowerCase().includes(specSearch.toLowerCase())
  );

  if (loadingJob) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin mr-2 h-8 w-8 text-[#6A38C2]" />
      </div>
    );
  }

  // Helper để check xem field có disabled không (Fix UI visual)
  const isDistrictDisabled = !form.watch("location.province");
  const isWardDisabled = !form.watch("location.district");

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/recruiter/jobs")}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Update Job</h1>
            <p className="text-sm text-gray-500">
              Edit job details and requirements.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-8 space-y-8">
                {/* --- 1. BASIC INFORMATION --- */}
                <Section title="Basic Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            Job Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Senior Frontend Developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* COMPANY */}
                    <SearchableSelect
                      id="company-select"
                      form={form}
                      name="company"
                      label="Company"
                      options={activeCompanies}
                      placeholder="Select company"
                      emptyMessage="No company found."
                      isRequired
                    />

                    {/* CATEGORY */}
                    <SearchableSelect
                      id="category-select"
                      form={form}
                      name="category"
                      label="Category"
                      options={categoryOptions}
                      placeholder="Select category"
                      emptyMessage="No category found."
                      isRequired
                    />
                  </div>
                </Section>

                {/* --- 2. PROFESSIONAL SPECIALIZATION --- */}
                <Section title="Professional Specialization">
                  <FormField
                    control={form.control}
                    name="professional"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <div className="text-sm font-medium leading-none mb-2">
                          Specializations{" "}
                          <span className="text-red-500">*</span>
                        </div>

                        <div className="border rounded-lg p-4 bg-gray-50/50 space-y-3">
                          {/* Selected Tags */}
                          {field.value?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {field.value.map((val) => {
                                const specLabel =
                                  ProfessionalSpecializations.find(
                                    (s) => s.value === val
                                  )?.label || val;
                                return (
                                  <Badge
                                    key={val}
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 text-sm font-medium flex items-center gap-1"
                                  >
                                    {specLabel}
                                    <X
                                      className="h-3 w-3 cursor-pointer"
                                      onClick={() => {
                                        field.onChange(
                                          field.value.filter((v) => v !== val)
                                        );
                                      }}
                                    />
                                  </Badge>
                                );
                              })}
                            </div>
                          )}

                          {/* Search */}
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              placeholder="Search specialization..."
                              value={specSearch}
                              onChange={(e) => setSpecSearch(e.target.value)}
                              className="pl-9 bg-white"
                            />
                          </div>

                          {/* List */}
                          <div className="h-48 overflow-y-auto border rounded-md bg-white p-2">
                            {filteredSpecializations.length === 0 ? (
                              <p className="text-center text-sm text-gray-500 py-4">
                                No specialization found.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {filteredSpecializations.map((item) => (
                                  <div
                                    key={item.value}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                                      field.value?.includes(item.value)
                                        ? "bg-purple-50"
                                        : "hover:bg-gray-100"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      id={`spec-${item.value}`}
                                      className="accent-[#6A38C2] h-4 w-4 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                                      checked={field.value?.includes(
                                        item.value
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          field.onChange([
                                            ...(field.value || []),
                                            item.value,
                                          ]);
                                        } else {
                                          field.onChange(
                                            field.value?.filter(
                                              (val) => val !== item.value
                                            )
                                          );
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`spec-${item.value}`}
                                      className="flex-1 text-sm text-gray-700 cursor-pointer font-medium select-none"
                                    >
                                      {item.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Section>

                {/* --- 3. DETAILS & BENEFITS --- */}
                <Section title="Job Details & Benefits">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Description <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the role..."
                              className="min-h-[120px]"
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
                        name="requirements"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Requirements (One per line)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="- ReactJS\n- Node.js"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="benefits"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Benefits (One per line)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="- Health Insurance\n- Remote"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Section>

                {/* --- 4. JOB ATTRIBUTES --- */}
                <Section title="Job Attributes">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="jobType"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel>Job Type</FormLabel>
                          <div className="flex flex-wrap gap-3 mt-2">
                            {[
                              "Full-time",
                              "Part-time",
                              "Remote",
                              "Contract",
                              "Internship",
                            ].map((type) => (
                              <div
                                key={type}
                                className={`flex items-center space-x-2 border rounded-lg px-4 py-2 cursor-pointer transition-colors ${
                                  field.value?.includes(type)
                                    ? "bg-purple-50 border-purple-200"
                                    : "bg-white border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                <Checkbox
                                  id={`jobType-${type}`}
                                  checked={field.value?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    field.onChange(
                                      checked
                                        ? [...(field.value || []), type]
                                        : field.value?.filter((t) => t !== type)
                                    );
                                  }}
                                  className="data-[state=checked]:bg-[#6A38C2] data-[state=checked]:border-[#6A38C2]"
                                />
                                <label
                                  htmlFor={`jobType-${type}`}
                                  className="text-sm font-medium cursor-pointer select-none"
                                >
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2 Years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seniorityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seniority</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[
                                "Intern",
                                "Junior",
                                "Mid",
                                "Senior",
                                "Lead",
                                "Manager",
                                "Director",
                                "Executive",
                              ].map((l) => (
                                <SelectItem key={l} value={l}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numberOfPositions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hiring Count</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 5. SALARY --- */}
                <Section title="Salary & Timeline">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Min</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Max</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 items-end">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel>Currency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="VND">VND</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isNegotiable"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 pb-2">
                            <FormControl>
                              <Checkbox
                                id="isNegotiable"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="isNegotiable"
                              className="font-normal cursor-pointer m-0 mt-0"
                            >
                              Negotiable
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="applicationDeadline"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel>Application Deadline</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="md:w-1/3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 6. LOCATION (Nested Object) --- */}
                <Section title="Location" isLast>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SearchableSelect
                      id="province-select"
                      form={form}
                      name="location.province"
                      label="City / Province"
                      options={provinceOptions}
                      placeholder="Select City"
                      emptyMessage="No city found."
                      onChange={handleProvinceChange}
                    />

                    <SearchableSelect
                      id="district-select"
                      form={form}
                      name="location.district"
                      label="District"
                      options={districtOptions}
                      placeholder="Select District"
                      emptyMessage="Select province first."
                      // Sử dụng watch để reactively update disabled state
                      disabled={isDistrictDisabled}
                      onChange={handleDistrictChange}
                    />

                    <SearchableSelect
                      id="ward-select"
                      form={form}
                      name="location.ward"
                      label="Ward"
                      options={wardOptions}
                      placeholder="Select Ward"
                      emptyMessage="Select district first."
                      // Sử dụng watch để reactively update disabled state
                      disabled={isWardDisabled}
                    />

                    <FormField
                      control={form.control}
                      name="location.address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Full Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 123 Le Loi Street"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>
              </div>

              {/* FOOTER */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/recruiter/jobs")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#6A38C2] hover:bg-[#5a2ea6] text-white min-w-[150px]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

// --- HELPER COMPONENTS ---

const Section = ({ title, children, isLast }) => (
  <div className={`${!isLast ? "border-b border-gray-100 pb-8" : ""}`}>
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
      {title}
    </h3>
    {children}
  </div>
);

export default UpdateJob;
