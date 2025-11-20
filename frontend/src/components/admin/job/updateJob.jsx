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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Loader2,
  ArrowLeft,
  FileText,
  MapPin,
  DollarSign,
  Building2,
  Layers,
} from "lucide-react";

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

  // ---------------------------------------------------------
  //   LOAD JOB DETAILS
  // ---------------------------------------------------------
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
        toast.error("Failed to load job");
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [id, form]);

  // ---------------------------------------------------------
  //   HANDLE SUBMIT
  // ---------------------------------------------------------
  const onSubmit = async (data) => {
    try {
      setIsSaving(true);

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
        toast.success("Job updated successfully!");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingJob)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );

  // ---------------------------------------------------------
  //   UI
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
            onClick={() => navigate("/admin/jobs")}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">
            Update Job Posting
          </h1>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto py-8 px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <Form {...form}>
            <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-6">
                {/* JOB DETAILS */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText size={18} className="text-[#6A38C2]" /> Job
                      Details
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-5">
                    {/* TITLE */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Backend Developer"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* DESCRIPTION */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Job responsibilities..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* REQUIREMENTS & BENEFITS */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requirements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="- ReactJS\n- Node.js"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="benefits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Benefits</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="- Health Insurance\n- Remote"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* LOCATION */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin size={18} className="text-green-600" /> Location
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-6 grid md:grid-cols-2 gap-5">
                    {/* PROVINCE */}
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

                    {/* DISTRICT */}
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

                    {/* ADDRESS */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Full Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Le Loi Street..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* ORGANIZATION */}
                <Card className="p-5 border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Building2 size={18} className="text-purple-600" />{" "}
                    Organization
                  </h3>

                  {/* COMPANY */}
                  <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
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

                  {/* CATEGORY */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
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
                </Card>

                {/* SALARY */}
                <Card className="p-5 border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <DollarSign size={18} className="text-yellow-600" /> Salary
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {/* MIN */}
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* MAX */}
                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Currency + Negotiable */}
                  <div className="flex items-center justify-between">
                    {/* CURRENCY */}
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="w-24">
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

                    {/* NEGOTIABLE */}
                    <FormField
                      control={form.control}
                      name="isNegotiable"
                      render={({ field }) => (
                        <FormItem className="flex gap-2 items-center">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Negotiable
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* JOB TYPE CHECKBOXES */}
                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            "Full-time",
                            "Part-time",
                            "Remote",
                            "Contract",
                            "Internship",
                          ].map((type) => (
                            <label
                              key={type}
                              className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2"
                            >
                              <Checkbox
                                checked={field.value.includes(type)}
                                onCheckedChange={(checked) => {
                                  field.onChange(
                                    checked
                                      ? [...field.value, type]
                                      : field.value.filter((t) => t !== type)
                                  );
                                }}
                              />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </Card>

                {/* ATTRIBUTES */}
                <Card className="p-5 border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Layers size={18} className="text-[#6A38C2]" /> Attributes
                  </h3>

                  {/* EXPERIENCE */}
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2+ Years" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* SENIORITY */}
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
                              <SelectValue placeholder="Select" />
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

                  {/* POSITIONS */}
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hiring Count</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* DEADLINE */}
                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </Card>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-end gap-4 px-4 md:px-8">
          <Button
            variant="outline"
            className="w-32 border-gray-300"
            onClick={() => navigate("/admin/jobs")}
          >
            Cancel
          </Button>

          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving}
            className="w-40 bg-[#6A38C2] hover:bg-[#5a2ea6] text-white font-semibold"
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
      </div>
    </div>
  );
};

export default UpdateJob;
