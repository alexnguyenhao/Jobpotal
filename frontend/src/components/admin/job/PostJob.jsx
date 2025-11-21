import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FormDescription,
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

const PostJob = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  // --- HANDLE SUBMIT ---
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // 1. Format Requirements & Benefits (Split by new line)
      const formattedRequirements = data.requirements
        ? data.requirements.split("\n").filter((line) => line.trim() !== "")
        : [];

      const formattedBenefits = data.benefits
        ? data.benefits.split("\n").filter((line) => line.trim() !== "")
        : [];

      // 2. Create Payload
      const payload = {
        ...data,
        salaryMin: Number(data.salaryMin),
        salaryMax: Number(data.salaryMax),
        position: Number(data.position),
        company: data.companyId,
        category: data.categoryId,
        requirements: formattedRequirements,
        benefits: formattedBenefits,
      };

      const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Job posted successfully!");
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error posting job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* --- HEADER --- */}
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
          <div>
            <h1 className="text-xl font-bold text-gray-900">Post New Job</h1>
            <p className="text-xs text-gray-500 hidden md:block">
              Create a new opportunity for candidates.
            </p>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 overflow-y-auto py-8 px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <Form {...form}>
            <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* === LEFT COLUMN (2/3) === */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. JOB DETAILS CARD */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText size={18} className="text-[#6A38C2]" /> Job
                      Details
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-5">
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Job Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Senior Frontend Developer"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
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
                              placeholder="Describe the role and responsibilities..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Requirements & Benefits */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requirements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="- ReactJS\n- Node.js\n(One per line)"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-[10px] text-gray-500">
                              Press <b>Enter</b> for new line
                            </FormDescription>
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
                                placeholder="- Health Insurance\n- Remote\n(One per line)"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-[10px] text-gray-500">
                              Press <b>Enter</b> for new line
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 2. LOCATION CARD */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin size={18} className="text-green-600" /> Location
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-6 grid md:grid-cols-2 gap-5">
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
                            <Input placeholder="e.g. District 1" {...field} />
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
                              placeholder="e.g. 123 Le Loi Street, Ben Nghe Ward"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* === RIGHT COLUMN (1/3) === */}
              <div className="space-y-6">
                {/* 3. ORGANIZATION CARD */}
                <Card className="p-5 border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-gray-800">
                    <Building2 size={18} className="text-purple-600" />{" "}
                    Organization
                  </h3>

                  {/* Company */}
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

                  {/* Category */}
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
                </Card>

                {/* 4. SALARY CARD */}
                <Card className="p-5 border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-gray-800">
                    <DollarSign size={18} className="text-yellow-600" /> Salary
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
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
                          <FormLabel className="font-normal cursor-pointer m-0">
                            Negotiable
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Job Type */}
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
                              className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-200 transition"
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
                              />
                              <span className="text-xs font-medium">
                                {type}
                              </span>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* 5. ATTRIBUTES CARD */}
                <Card className="p-5 border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-gray-800">
                    <Layers size={18} className="text-[#6A38C2]" /> Attributes
                  </h3>

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

      {/* --- STICKY FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex justify-end gap-4 px-4 md:px-8">
          <Button
            type="button"
            variant="outline"
            className="w-32 border-gray-300"
            onClick={() => navigate("/admin/jobs")}
          >
            Cancel
          </Button>

          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-40 bg-[#6A38C2] hover:bg-[#5a2ea6] text-white font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Job"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
