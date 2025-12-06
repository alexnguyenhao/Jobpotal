import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectSearch } from "./shared/SelectSearch";
// 1. Import thêm icon X
import { Search, MapPin, Briefcase, X } from "lucide-react";
import { provinces } from "@/utils/constant";

const JobFilterBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories } = useSelector((store) => store.category);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      location: "",
      category: "",
    },
  });

  // 2. Theo dõi giá trị của title để hiển thị/ẩn nút X
  const titleValue = watch("title");

  useEffect(() => {
    setValue("title", searchParams.get("keyword") || "");
    setValue("location", searchParams.get("location") || "");
    setValue("category", searchParams.get("category") || "");
  }, [searchParams, setValue]);

  const onSubmit = (data) => {
    const currentParams = new URLSearchParams(window.location.search);

    if (data.title) currentParams.set("keyword", data.title);
    else currentParams.delete("keyword");

    if (data.location) currentParams.set("location", data.location);
    else currentParams.delete("location");

    if (data.category) currentParams.set("category", data.category);
    else currentParams.delete("category");

    navigate(`/jobs?${currentParams.toString()}`);
  };

  // Hàm xử lý khi click vào nút X
  const handleClearTitle = () => {
    setValue("title", "");
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white p-2 rounded-2xl shadow-lg shadow-purple-100/50 border border-slate-200/60 flex flex-col md:flex-row items-center gap-2 md:gap-0 transition-all hover:shadow-purple-200/60">
          {/* --- SEARCH TITLE INPUT --- */}
          <div className="flex items-center px-4 w-full md:flex-1 h-12 border-b md:border-b-0 md:border-r border-slate-100 group">
            <Search className="text-slate-400 w-5 h-5 mr-3 flex-shrink-0" />
            <div className="relative w-full flex items-center">
              <Input
                placeholder="Search by job title..."
                className="border-none shadow-none focus-visible:ring-0 px-0 text-slate-700 placeholder:text-slate-400 bg-transparent font-medium text-base w-full pr-8" // pr-8 để tránh text bị đè lên icon X
                {...register("title")}
              />
              {titleValue && (
                <button
                  type="button"
                  onClick={handleClearTitle}
                  className="absolute right-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* --- CATEGORY SELECT --- */}
          <div className="flex items-center px-4 w-full md:w-[240px] h-12 border-b md:border-b-0 md:border-r border-slate-100">
            <Briefcase className="text-slate-400 w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <SelectSearch
                items={categories}
                value={watch("category")}
                onChange={(v) => setValue("category", v)}
                placeholder="Category"
                labelKey="name"
                valueKey="_id"
                className="border-none shadow-none p-0 text-slate-700 font-medium bg-transparent focus:ring-0 w-full"
              />
            </div>
          </div>

          {/* --- LOCATION SELECT --- */}
          <div className="flex items-center px-4 w-full md:w-[220px] h-12 border-b md:border-b-0 border-slate-100 md:border-none">
            <MapPin className="text-slate-400 w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <SelectSearch
                items={provinces.map((p) => ({ _id: p, name: p }))}
                value={watch("location")}
                onChange={(v) => setValue("location", v)}
                placeholder="Location"
                labelKey="name"
                valueKey="_id"
                className="border-none shadow-none p-0 text-slate-700 font-medium bg-transparent focus:ring-0 w-full"
              />
            </div>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <div className="p-1 w-full md:w-auto">
            <Button
              type="submit"
              className="w-full md:w-auto rounded-xl bg-[#6A38C2] hover:bg-[#5a2ea6] text-white px-8 h-12 font-bold text-base shadow-lg shadow-purple-200 transition-all hover:scale-105"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobFilterBar;
