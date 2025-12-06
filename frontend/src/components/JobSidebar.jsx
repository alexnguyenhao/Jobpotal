import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Filter, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

const JobSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    experience: searchParams.get("experience") || "",
    jobType: searchParams.get("jobType") || "",
    seniorityLevel: searchParams.get("seniorityLevel") || "",
    datePosted: searchParams.get("datePosted") || "all",
  });

  useEffect(() => {
    setFilters({
      experience: searchParams.get("experience") || "",
      jobType: searchParams.get("jobType") || "",
      seniorityLevel: searchParams.get("seniorityLevel") || "",
      datePosted: searchParams.get("datePosted") || "all",
    });
  }, [searchParams]);

  const handleFilterSelect = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      experience: "",
      jobType: "",
      seniorityLevel: "",
      datePosted: "all",
    });
    const params = new URLSearchParams();
    if (searchParams.get("keyword"))
      params.set("keyword", searchParams.get("keyword"));
    if (searchParams.get("location"))
      params.set("location", searchParams.get("location"));
    if (searchParams.get("category"))
      params.set("category", searchParams.get("category"));
    setSearchParams(params);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24 overflow-hidden flex flex-col w-full">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white z-10">
        <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#6A38C2]" />
          Filter
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
        </Button>
      </div>

      <div className="overflow-y-auto custom-scrollbar p-5 space-y-6 max-h-[calc(100vh-140px)]">
        <FilterGroup title="Date Posted" isOpenDefault={true}>
          <FilterItem
            label="All time"
            active={filters.datePosted === "all" || !filters.datePosted}
            onClick={() => handleFilterSelect("datePosted", "all")}
          />
          <FilterItem
            label="Past 24 hours"
            active={filters.datePosted === "1"}
            onClick={() => handleFilterSelect("datePosted", "1")}
          />
          <FilterItem
            label="Past 3 days"
            active={filters.datePosted === "3"}
            onClick={() => handleFilterSelect("datePosted", "3")}
          />
          <FilterItem
            label="Past week"
            active={filters.datePosted === "7"}
            onClick={() => handleFilterSelect("datePosted", "7")}
          />
        </FilterGroup>

        <Separator />

        <FilterGroup title="Seniority Level" isOpenDefault={true}>
          <FilterItem
            label="All Levels"
            active={
              filters.seniorityLevel === "" || filters.seniorityLevel === "all"
            }
            onClick={() => handleFilterSelect("seniorityLevel", "all")}
          />
          <FilterItem
            label="Intern"
            active={filters.seniorityLevel === "Intern"}
            onClick={() => handleFilterSelect("seniorityLevel", "Intern")}
          />
          <FilterItem
            label="Junior"
            active={filters.seniorityLevel === "Junior"}
            onClick={() => handleFilterSelect("seniorityLevel", "Junior")}
          />
          <FilterItem
            label="Mid-Level"
            active={filters.seniorityLevel === "Mid"}
            onClick={() => handleFilterSelect("seniorityLevel", "Mid")}
          />
          <FilterItem
            label="Senior"
            active={filters.seniorityLevel === "Senior"}
            onClick={() => handleFilterSelect("seniorityLevel", "Senior")}
          />
          <FilterItem
            label="Team Lead"
            active={filters.seniorityLevel === "Lead"}
            onClick={() => handleFilterSelect("seniorityLevel", "Lead")}
          />
          <FilterItem
            label="Manager"
            active={filters.seniorityLevel === "Manager"}
            onClick={() => handleFilterSelect("seniorityLevel", "Manager")}
          />
          <FilterItem
            label="Director"
            active={filters.seniorityLevel === "Director"}
            onClick={() => handleFilterSelect("seniorityLevel", "Director")}
          />
          <FilterItem
            label="Executive"
            active={filters.seniorityLevel === "Executive"}
            onClick={() => handleFilterSelect("seniorityLevel", "Executive")}
          />
        </FilterGroup>

        <Separator />

        <FilterGroup title="Job Type">
          <FilterItem
            label="All Types"
            active={filters.jobType === "" || filters.jobType === "all"}
            onClick={() => handleFilterSelect("jobType", "all")}
          />
          <FilterItem
            label="Full-time"
            active={filters.jobType === "Full-time"}
            onClick={() => handleFilterSelect("jobType", "Full-time")}
          />
          <FilterItem
            label="Part-time"
            active={filters.jobType === "Part-time"}
            onClick={() => handleFilterSelect("jobType", "Part-time")}
          />
          <FilterItem
            label="Remote"
            active={filters.jobType === "Remote"}
            onClick={() => handleFilterSelect("jobType", "Remote")}
          />
          <FilterItem
            label="Freelance"
            active={filters.jobType === "Freelance"}
            onClick={() => handleFilterSelect("jobType", "Freelance")}
          />
        </FilterGroup>

        <Separator />

        <FilterGroup title="Experience">
          <FilterItem
            label="Any Experience"
            active={filters.experience === "" || filters.experience === "all"}
            onClick={() => handleFilterSelect("experience", "all")}
          />
          <FilterItem
            label="No Experience"
            active={filters.experience === "0"}
            onClick={() => handleFilterSelect("experience", "0")}
          />
          <FilterItem
            label="Less than 1 year"
            active={filters.experience === "1"}
            onClick={() => handleFilterSelect("experience", "1")}
          />
          <FilterItem
            label="1 - 3 years"
            active={filters.experience === "2"}
            onClick={() => handleFilterSelect("experience", "2")}
          />
          <FilterItem
            label="3 - 5 years"
            active={filters.experience === "3"}
            onClick={() => handleFilterSelect("experience", "3")}
          />
          <FilterItem
            label="More than 5 years"
            active={filters.experience === "5"}
            onClick={() => handleFilterSelect("experience", "5")}
          />
        </FilterGroup>
      </div>
    </div>
  );
};

const FilterItem = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`
      group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm mb-1
      ${
        active
          ? "bg-purple-50 text-[#6A38C2] font-semibold"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }
    `}
  >
    <span className="flex-1">{label}</span>
    {active && <Check className="w-4 h-4 text-[#6A38C2]" />}
  </div>
);

const FilterGroup = ({ title, children, isOpenDefault = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between mb-2 cursor-pointer group select-none"
      >
        <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#6A38C2] transition-colors">
          {title}
        </h4>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#6A38C2]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#6A38C2]" />
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const Separator = () => <div className="h-[1px] bg-gray-100 my-4" />;

export default JobSidebar;
