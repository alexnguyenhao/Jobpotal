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
import { SelectSearch } from "./shared/SelectSearch"; // Component SelectSearch của bạn

// Icons
import {
  Search,
  SlidersHorizontal,
  X,
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
    <div className="w-full max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 transition-all duration-300"
      >
        {/* --- TOP SECTION: MAIN SEARCH --- */}
        <div className="flex flex-col md:flex-row items-center gap-2 p-2">
          {/* 1. Keyword Input */}
          <div className="relative flex-grow w-full md:w-auto group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#6A38C2] transition-colors" />
            <Input
              placeholder="Search job title, keyword, or company..."
              className="h-12 pl-10 border-transparent bg-gray-50 focus:bg-white focus:border-[#6A38C2]/30 focus:ring-2 focus:ring-[#6A38C2]/20 rounded-xl text-base"
              {...register("title")}
            />
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-gray-200 mx-1"></div>

          {/* 2. Location Select */}
          <div className="w-full md:w-[220px] relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10 pointer-events-none" />
            <div className="pl-7">
              <SelectSearch
                items={provinces.map((p) => ({ _id: p, name: p }))}
                value={watch("location")}
                onChange={(v) => setValue("location", v)}
                placeholder="All Locations"
                labelKey="name"
                valueKey="_id"
                className="h-12 border-none bg-transparent focus:ring-0 shadow-none text-gray-600 font-medium"
              />
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`h-12 px-4 border-gray-200 rounded-xl hover:bg-purple-50 hover:text-[#6A38C2] hover:border-purple-200 transition-all ${
                showAdvanced
                  ? "bg-purple-50 text-[#6A38C2] border-purple-200"
                  : "text-gray-600"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <Button
              type="submit"
              className="h-12 px-8 bg-[#6A38C2] hover:bg-[#582bb6] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex-grow md:flex-grow-0"
            >
              Search Jobs
            </Button>
          </div>
        </div>

        {/* --- BOTTOM SECTION: ADVANCED FILTERS --- */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100 mt-2 p-4 md:p-6 bg-gray-50/50 rounded-b-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                      <SelectTrigger className="bg-white h-10 rounded-lg border-gray-200">
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
                      <SelectTrigger className="bg-white h-10 rounded-lg border-gray-200">
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
                        className="bg-white h-10 rounded-lg border-gray-200 text-sm"
                        type="number"
                      />
                      <span className="text-gray-400">-</span>
                      <Input
                        {...register("salaryMax")}
                        placeholder="Max"
                        className="bg-white h-10 rounded-lg border-gray-200 text-sm"
                        type="number"
                      />
                    </div>
                  </FilterGroup>

                  {/* Experience */}
                  <FilterGroup label="Experience (Years)">
                    <Input
                      {...register("experience")}
                      placeholder="e.g. 2"
                      className="bg-white h-10 rounded-lg border-gray-200 text-sm"
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

                {/* Footer Actions */}
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
                    className="ml-3 bg-[#6A38C2] hover:bg-[#582bb6] text-white h-9 px-6 text-sm rounded-lg"
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
