import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

// Store & Utils
import { JOB_API_END_POINT, provinces } from "@/utils/constant";
import { jobSchema } from "@/lib/jobSchema";
import useGetAllCategories from "@/hooks/useGetAllCategoris";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";

// Icons
import { Loader2, ArrowLeft } from "lucide-react";

const UpdateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [loadingJob, setLoadingJob] = useState(true);

  const { companies } = useSelector((store) => store.company);
  const { categories } = useSelector((store) => store.category);

  useGetAllCategories();

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
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });

        if (!res.data.success) throw new Error();

        const job = res.data.job;

        form.reset({
          title: job.title,
          description: job.description,
          requirements: job.requirements?.join("\n") || "",
          benefits: job.benefits?.join("\n") || "",
          salaryMin: job.salary?.min,
          salaryMax: job.salary?.max,
          currency: job.salary?.currency || "VND",
          isNegotiable: job.salary?.isNegotiable,
          province: job.location?.province,
          district: job.location?.district,
          address: job.location?.address,
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
      } catch (err) {
        toast.error("Failed to load job details");
        navigate("/recruiter/jobs");
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [id, navigate, form]);
  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      const formattedRequirements = typeof data.requirements === 'string' 
        ? data.requirements.split("\n").filter(line => line.trim() !== "") 
        : data.requirements;
        
      const formattedBenefits = typeof data.benefits === 'string'
        ? data.benefits.split("\n").filter(line => line.trim() !== "")
        : data.benefits;

      const payload = {
        ...data,
        requirements: formattedRequirements,
        benefits: formattedBenefits,
        company: data.companyId,
        category: data.categoryId,
        salaryMin: Number(data.salaryMin),
        salaryMax: Number(data.salaryMax),
        position: Number(data.position),
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
        toast.success("Job updated successfully!");
        navigate("/recruiter/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingJob)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin mr-2 h-8 w-8 text-[#6A38C2]" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* --- HEADER --- */}
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

        {/* --- MAIN FORM CONTAINER --- */}
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

                    <FormField
                      control={form.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Company <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies.map((c) => (
                                <SelectItem key={c._id} value={c._id}>
                                  {c.name}
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
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Category <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((c) => (
                                <SelectItem key={c._id} value={c._id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 2. DETAILS & DESCRIPTION --- */}
                <Section title="Job Details">
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
                          <FormItem>
                            <FormLabel>Requirements (One per line)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="- Skill 1\n- Skill 2"
                                className="min-h-[150px]"
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
                          <FormItem>
                            <FormLabel>Benefits (One per line)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="- Benefit 1\n- Benefit 2"
                                className="min-h-[150px]"
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

                {/* --- 3. ATTRIBUTES --- */}
                <Section title="Attributes">
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
                              <label
                                key={type}
                                className={`flex items-center space-x-2 border rounded-lg px-4 py-2 cursor-pointer transition-colors ${
                                  field.value?.includes(type)
                                    ? "bg-purple-50 border-purple-200"
                                    : "bg-white border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                <Checkbox
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
                                <span className="text-sm font-medium">
                                  {type}
                                </span>
                              </label>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience (Years)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2" {...field} />
                          </FormControl>
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
                                "Fresher",
                                "Junior",
                                "Mid",
                                "Senior",
                                "Lead",
                                "Manager",
                              ].map((l) => (
                                <SelectItem key={l} value={l}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hiring Count</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 4. SALARY & DEADLINE --- */}
                <Section title="Salary & Timeline">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Min</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
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
                            <Input type="number" {...field} />
                          </FormControl>
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
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer m-0 mt-0">
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
                            <Input type="date" className="md:w-1/3" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                {/* --- 5. LOCATION --- */}
                <Section title="Location" isLast>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City / Province</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
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
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input placeholder="District..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Full Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Street address..."
                              {...field}
                            />
                          </FormControl>
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

// Helper Section Component
const Section = ({ title, children, isLast }) => (
  <div className={`${!isLast ? "border-b border-gray-100 pb-8" : ""}`}>
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
      {title}
    </h3>
    {children}
  </div>
);

export default UpdateJob;