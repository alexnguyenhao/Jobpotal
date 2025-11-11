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
import { Search, Filter, ChevronDown, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectSearch } from "./shared/SelectSearch";

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
  const handleTitleChange = (e) => {
    setValue("title", e.target.value);
  };
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
    setShowAdvanced(false);
    navigate("/jobs");
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* TOP FILTER ROW */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Keyword */}
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Search job title, skill..."
              {...register("title")}
              onChange={handleTitleChange}
              value={watch("title")}
              className="h-9 pl-8 text-sm"
            />
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {/* Location */}
          <SelectSearch
            items={provinces.map((p) => ({ _id: p, name: p }))}
            value={watch("location")}
            onChange={(v) => setValue("location", v)}
            placeholder="Location"
            labelKey="name"
            valueKey="_id"
          />

          {/* Category */}
          <SelectSearch
            items={categories}
            value={watch("category")}
            onChange={(v) => setValue("category", v)}
            placeholder="Category"
            labelKey="name"
            valueKey="_id"
          />

          {/* Search Button */}
          <Button
            type="submit"
            className="h-9 px-4 bg-[#7209B7] hover:bg-[#5c0f8e] text-white text-sm"
          >
            <Search className="w-4 h-4 mr-1" />
            Search
          </Button>

          {/* Toggle Advanced */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-[#7209B7] text-sm font-medium hover:underline"
          >
            {showAdvanced ? "Hide Filters" : "More Filters"}
          </button>
        </div>

        {/* ADVANCED FILTER PANEL */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 pt-3 mt-1"
            >
              <div className="flex flex-wrap gap-2">
                <div>
                  <p className="font-medium text-gray-600 mb-1">Job type</p>
                  <Select
                    onValueChange={(v) => setValue("jobType", v)}
                    value={watch("jobType")}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs font-medium bg-gray-50 border-gray-300 rounded-full px-3">
                      <SelectValue placeholder="Job Type" />
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
                </div>

                {/* Seniority */}
                <div>
                  <p className="font-medium text-gray-600 mb-1">Seniority</p>
                  <Select
                    onValueChange={(v) => setValue("seniorityLevel", v)}
                    value={watch("seniorityLevel")}
                  >
                    <SelectTrigger className="h-8 w-[150px] text-xs font-medium bg-gray-50 border-gray-300 rounded-full px-3">
                      <SelectValue placeholder="Seniority" />
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
                </div>

                {/* Salary Range */}
                <div>
                  <p className="font-medium text-gray-600 mb-1">Salary:</p>
                  <div className="flex items-center bg-gray-50 h-8 px-3 rounded-full border border-gray-300 text-xs gap-1">
                    <Input
                      {...register("salaryMin")}
                      placeholder="Min"
                      className="h-7 w-14 text-xs border-none bg-transparent"
                    />
                    <span>-</span>
                    <Input
                      {...register("salaryMax")}
                      placeholder="Max"
                      className="h-7 w-14 text-xs border-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <p className="font-medium text-gray-600">Experience:</p>
                  <Input
                    {...register("experience")}
                    placeholder="Experience"
                    className="h-8 text-xs w-[150px] bg-gray-50 border-gray-300 rounded-full px-3"
                  />
                </div>

                {/* Company */}
                <div>
                  <p className="font-medium text-gray-600">Company:</p>
                  <SelectSearch
                    items={companies}
                    value={watch("company")}
                    onChange={(v) => setValue("company", v)}
                    placeholder="Company"
                    labelKey="name"
                    valueKey="_id"
                  />
                </div>
              </div>

              {/* Apply + Reset */}
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="h-8 text-xs px-3 rounded-full"
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  className="h-8 text-xs px-4 rounded-full bg-[#7209B7] hover:bg-[#5c0f8e] text-white"
                >
                  Apply
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

const FilterField = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 mb-1 block">
      {label}
    </label>
    {children}
  </div>
);

export default JobFilterBar;
