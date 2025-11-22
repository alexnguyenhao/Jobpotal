import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectSearch } from "./shared/SelectSearch"; // Component của bạn

// Icons
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Banknote,
  Users,
  RotateCcw,
} from "lucide-react";
import { provinces } from "@/utils/constant";

const JobFilterBar = () => {
  const navigate = useNavigate();
  const { categories } = useSelector((store) => store.category);
  const { companies } = useSelector((store) => store.company);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",
      location: "",
      category: "",
      jobType: "",
      seniorityLevel: "",
      salaryMin: "",
      salaryMax: "",
      experience: "",
      company: "",
    },
  });

  const onSubmit = (data) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, val]) => {
      if (val && val !== "") {
        params.append(key === "title" ? "keyword" : key, val);
      }
    });
    navigate(`/jobs?${params.toString()}`);
  };

  const handleReset = () => {
    reset();
    navigate("/jobs");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- MAIN SEARCH BAR (HERO STYLE) --- */}
        {/* Container hình viên thuốc, đổ bóng tím */}
        <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-xl shadow-purple-100/50 border border-slate-200/60 flex flex-col md:flex-row items-center gap-2 md:gap-0 relative z-20 transition-all duration-300 hover:shadow-purple-200/60">
          
          {/* 1. Keyword Input */}
          <div className="flex items-center px-4 w-full md:flex-1 h-12 md:h-auto border-b md:border-b-0 md:border-r border-slate-100">
            <Search className="text-slate-400 w-5 h-5 mr-3 flex-shrink-0" />
            <Input
              placeholder="Search job title, keyword, or company..."
              className="border-none shadow-none focus-visible:ring-0 px-0 text-slate-700 placeholder:text-slate-400 bg-transparent font-medium h-auto text-base"
              {...register("title")}
            />
          </div>

          {/* 2. Location Select */}
          <div className="flex items-center px-4 w-full md:w-[240px] h-12 md:h-auto border-b md:border-b-0 md:border-r border-slate-100">
            <MapPin className="text-slate-400 w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <SelectSearch
                items={provinces.map((p) => ({ _id: p, name: p }))}
                value={watch("location")}
                onChange={(v) => setValue("location", v)}
                placeholder="All Locations"
                labelKey="name"
                valueKey="_id"
                // Style đè để loại bỏ viền của SelectSearch
                className="border-none shadow-none p-0 h-auto text-slate-700 font-medium bg-transparent focus:ring-0 w-full"
              />
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="flex items-center gap-2 p-1 w-full md:w-auto justify-end md:justify-start">
            {/* Filter Toggle Button */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`rounded-xl md:rounded-full px-4 h-12 font-medium transition-all ${
                showAdvanced
                  ? "bg-purple-50 text-[#6A38C2]"
                  : "text-slate-500 hover:bg-purple-50 hover:text-[#6A38C2]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Filters</span>
            </Button>

            {/* Search Button */}
            <Button
              type="submit"
              className="w-full md:w-auto rounded-xl md:rounded-full bg-[#6A38C2] hover:bg-[#5a2ea6] text-white px-8 h-12 font-bold text-base shadow-lg shadow-purple-200 transition-all hover:scale-105"
            >
              Search
            </Button>
          </div>
        </div>

        {/* --- ADVANCED FILTERS SECTION (Floating Below) --- */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category */}
                  <FilterGroup
                    label="Category"
                    icon={<Briefcase className="w-4 h-4" />}
                  >
                    <SelectSearch
                      items={categories}
                      value={watch("category")}
                      onChange={(v) => setValue("category", v)}
                      placeholder="Select Category"
                      labelKey="name"
                      valueKey="_id"
                    />
                  </FilterGroup>

                  {/* Job Type */}
                  <FilterGroup
                    label="Job Type"
                    icon={<Briefcase className="w-4 h-4" />}
                  >
                    <Select
                      onValueChange={(v) => setValue("jobType", v)}
                      value={watch("jobType")}
                    >
                      <SelectTrigger className="bg-white h-10 rounded-lg border-gray-200 focus:ring-[#6A38C2]/20">
                        <SelectValue placeholder="Any Type" />
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
                  </FilterGroup>

                  {/* Seniority */}
                  <FilterGroup
                    label="Seniority"
                    icon={<Users className="w-4 h-4" />}
                  >
                    <Select
                      onValueChange={(v) => setValue("seniorityLevel", v)}
                      value={watch("seniorityLevel")}
                    >
                      <SelectTrigger className="bg-white h-10 rounded-lg border-gray-200 focus:ring-[#6A38C2]/20">
                        <SelectValue placeholder="Any Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Intern",
                          "Junior",
                          "Mid",
                          "Senior",
                          "Lead",
                          "Manager",
                        ].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FilterGroup>

                  {/* Salary Range */}
                  <FilterGroup
                    label="Salary Range (Monthly)"
                    icon={<Banknote className="w-4 h-4" />}
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        {...register("salaryMin")}
                        placeholder="Min"
                        className="bg-white h-10 rounded-lg border-gray-200 text-sm focus-visible:ring-[#6A38C2]/20"
                        type="number"
                      />
                      <span className="text-gray-400">-</span>
                      <Input
                        {...register("salaryMax")}
                        placeholder="Max"
                        className="bg-white h-10 rounded-lg border-gray-200 text-sm focus-visible:ring-[#6A38C2]/20"
                        type="number"
                      />
                    </div>
                  </FilterGroup>

                  {/* Experience */}
                  <FilterGroup label="Experience (Years)">
                    <Input
                      {...register("experience")}
                      placeholder="e.g. 2"
                      className="bg-white h-10 rounded-lg border-gray-200 text-sm focus-visible:ring-[#6A38C2]/20"
                      type="number"
                    />
                  </FilterGroup>

                  {/* Company */}
                  <FilterGroup label="Specific Company">
                    <SelectSearch
                      items={companies}
                      value={watch("company")}
                      onChange={(v) => setValue("company", v)}
                      placeholder="Select Company"
                      labelKey="name"
                      valueKey="_id"
                    />
                  </FilterGroup>
                </div>

                {/* Footer Actions for Advanced Filters */}
                <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 border-dashed">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleReset}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 gap-2 h-9 text-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                  </Button>
                  <Button
                    type="submit"
                    className="ml-3 bg-[#6A38C2] hover:bg-[#582bb6] text-white h-9 px-6 text-sm rounded-lg shadow-sm"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

// Helper Component for cleaner code
const FilterGroup = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
      {icon && <span className="text-[#6A38C2]">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

export default JobFilterBar;