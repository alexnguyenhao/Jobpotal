import React, { useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Label } from "@/components/ui/label.js";
import { Input } from "@/components/ui/input.js";
import { Textarea } from "@/components/ui/textarea.js";
import { Button } from "@/components/ui/button.js";
import { useSelector } from "react-redux";
import { Select } from "@radix-ui/react-select";
import useGetAllCategories from "@/hooks/useGetAllCategoris.jsx";

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.js";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: [],
    experience: "",
    position: 0,
    companyId: "",
    categoryId: "",
    seniorityLevel: "",
    applicationDeadline: "", // ✅ Thêm cấp bậc
  });

  useGetAllCategories();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const { categories } = useSelector((store) => store.category);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectCompanyHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany?._id });
  };

  const selectCategoryHandler = (value) => {
    const selectedCategory = categories.find(
      (cat) => cat.name.toLowerCase() === value
    );
    setInput({ ...input, categoryId: selectedCategory?._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        ...input,
        category: input.categoryId,
        company: input.companyId,
      };
      delete payload.categoryId;
      delete payload.companyId;

      const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
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

        <form
          onSubmit={submitHandler}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
        >
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={input.title}
              onChange={changeEventHandler}
              placeholder="e.g. Software Engineer"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company">Company</Label>
              {companies.length > 0 ? (
                <Select onValueChange={selectCompanyHandler}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xs text-red-600 font-bold mt-2">
                  *Please register company first
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              {categories.length > 0 ? (
                <Select onValueChange={selectCategoryHandler}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat._id}
                          value={cat.name.toLowerCase()}
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xs text-red-600 font-bold mt-2">
                  *Please add category first
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="e.g. New York"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="e.g. $80,000"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Job Type</Label>
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
                    checked={input.jobType.includes(type)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setInput((prev) => ({
                        ...prev,
                        jobType: checked
                          ? [...prev.jobType, type]
                          : prev.jobType.filter((t) => t !== type),
                      }));
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="position">Number of Positions</Label>
              <Input
                id="position"
                name="position"
                type="number"
                value={input.position}
                onChange={changeEventHandler}
                placeholder="e.g. 3"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                placeholder="e.g. 2+ years"
                className="mt-1"
              />
            </div>
          </div>

          {/* ✅ Thêm cấp bậc (Seniority) */}
          <div>
            <Label htmlFor="seniorityLevel">Seniority Level</Label>
            <Select
              onValueChange={(value) =>
                setInput({ ...input, seniorityLevel: value })
              }
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select seniority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {["Intern", "Junior", "Mid", "Senior", "Lead"].map(
                    (level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* ✅ Thêm hạn nộp hồ sơ */}
          <div>
            <Label htmlFor="applicationDeadline">Application Deadline</Label>
            <Input
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              value={input.applicationDeadline}
              onChange={changeEventHandler}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              value={input.description}
              onChange={changeEventHandler}
              placeholder="Describe job responsibilities, tasks..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              rows={5}
              value={input.requirements}
              onChange={changeEventHandler}
              placeholder="Required skills, qualifications..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              name="benefits"
              rows={5}
              value={input.benefits}
              onChange={changeEventHandler}
              placeholder="e.g. Health insurance, Paid time off..."
              className="mt-1"
            />
          </div>
          <div>
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Post New Job"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
