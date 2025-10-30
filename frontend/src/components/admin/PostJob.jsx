import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Textarea } from "@/components/ui/textarea.js";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select.js";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.js";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/lib/jobSchema.js";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllCategories from "@/hooks/useGetAllCategoris.jsx";

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
      salary: "",
      location: "",
      jobType: [],
      experience: "",
      position: 1,
      companyId: "",
      categoryId: "",
      seniorityLevel: "",
      applicationDeadline: "",
      benefits: "",
    },
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        category: data.categoryId,
        company: data.companyId,
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
      toast.error(error?.response?.data?.message || "Error posting job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-10 pt-[80px] max-w-4xl">
        <div className="mb-8">
          <Button
            onClick={() => navigate("/admin/jobs")}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Post a New Job
          </h1>
        </div>

        {/* ✅ ShadCN Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
          >
            {/* Title */}
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

            {/* Company & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {companies.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location & Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Hanoi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. $1000/month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Job Type */}
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

            {/* Position & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Positions</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2+ years" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seniority & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="seniorityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seniority Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Intern", "Junior", "Mid", "Senior", "Lead"].map(
                          (lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                              {lvl}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description, Requirements, Benefits */}
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
                        rows={5}
                        placeholder={`Enter ${name} details...`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Submit */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Post New Job"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PostJob;
