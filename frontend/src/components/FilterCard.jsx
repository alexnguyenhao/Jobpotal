import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { provinces } from "@/utils/constant";
import useGetAllCategories from "@/hooks/useGetAllCategoris";
import { Search, Filter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JobFilterBar = () => {
  const navigate = useNavigate();
  const { categories } = useSelector((store) => store.category);
  const { companies } = useSelector((store) => store.company);
  useGetAllCategories();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",
      company: "",
      category: "",
      location: "",
      jobType: "",
      experience: "",
      seniorityLevel: "",
      salaryMin: "",
      salaryMax: "",
    },
  });

  const onSubmit = (data) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, val]) => {
      if (val) {
        if (key === "title") params.append("keyword", val);
        else params.append(key, val);
      }
    });

    navigate(`/jobs?${params.toString()}`);
  };

  const handleReset = () => {
    reset();
    setShowAdvanced(false);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-5 w-full transition-all duration-300">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 🔍 Quick Search Row */}
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Title Input */}
          <div className="relative flex-1 w-full">
            <Input
              type="text"
              placeholder="Search job title, skill, or company..."
              {...register("title")}
              className="h-11 rounded-md text-[14px] border-gray-300 pl-10 focus:ring-1 focus:ring-[#7209B7] focus:border-[#7209B7]"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>

          {/* Category */}
          <Select
            onValueChange={(val) => setValue("category", val)}
            value={watch("category")}
          >
            <SelectTrigger className="h-11 w-full lg:w-[180px] text-sm border-gray-300 rounded-md focus:ring-1 focus:ring-[#7209B7]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location */}
          <Select
            onValueChange={(val) => setValue("location", val)}
            value={watch("location")}
          >
            <SelectTrigger className="h-11 w-full lg:w-[180px] text-sm border-gray-300 rounded-md focus:ring-1 focus:ring-[#7209B7]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button
            type="submit"
            className="h-11 px-6 bg-[#7209B7] hover:bg-[#5c0f8e] text-white flex items-center gap-2 rounded-md text-sm font-medium shadow-sm"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>

          {/* Advanced Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-[#7209B7] text-sm font-medium hover:underline"
          >
            <Filter className="w-4 h-4 mr-1" />
            {showAdvanced ? "Hide Filters" : "More Filters"}
            <ChevronDown
              className={`ml-1 w-4 h-4 transform transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* 🌈 Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden border-t border-gray-100 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Company */}
                <FilterField label="Company">
                  <Select
                    onValueChange={(val) => setValue("company", val)}
                    value={watch("company")}
                  >
                    <SelectTrigger className="h-10 border-gray-300 rounded-md focus:ring-1 focus:ring-[#7209B7]">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterField>

                {/* Job Type */}
                <FilterField label="Job Type">
                  <Select
                    onValueChange={(val) => setValue("jobType", val)}
                    value={watch("jobType")}
                  >
                    <SelectTrigger className="h-10 border-gray-300 rounded-md focus:ring-1 focus:ring-[#7209B7]">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Full-time",
                        "Part-time",
                        "Remote",
                        "Contract",
                        "Internship",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterField>

                {/* Experience */}
                <FilterField label="Experience">
                  <Input
                    type="text"
                    placeholder="e.g. 2+ years"
                    {...register("experience")}
                    className="h-10 border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#7209B7]"
                  />
                </FilterField>

                {/* Seniority */}
                <FilterField label="Seniority Level">
                  <Select
                    onValueChange={(val) => setValue("seniorityLevel", val)}
                    value={watch("seniorityLevel")}
                  >
                    <SelectTrigger className="h-10 border-gray-300 rounded-md focus:ring-1 focus:ring-[#7209B7]">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Intern",
                        "Junior",
                        "Mid",
                        "Senior",
                        "Lead",
                        "Manager",
                      ].map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>
                          {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterField>

                {/* Salary Range */}
                <FilterField label="Salary Range (VND)">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      {...register("salaryMin")}
                      className="h-10 w-[100px] text-sm border-gray-300 rounded-md focus:ring-1 focus:ring-[#7209B7]"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      {...register("salaryMax")}
                      className="h-10 w-[100px] text-sm border-gray-300 rounded-md focus:ring-1 focus:ring-[#7209B7]"
                    />
                  </div>
                </FilterField>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md text-sm"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="bg-[#7209B7] hover:bg-[#5c0f8e] text-white text-sm px-6"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

/* 🧩 Reusable Label Wrapper */
const FilterField = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 mb-1 block">
      {label}
    </label>
    {children}
  </div>
);

export default JobFilterBar;
