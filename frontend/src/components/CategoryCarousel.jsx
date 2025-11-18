import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllCategories from "../hooks/useGetAllCategoris";

// UI Components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  Code,
  Megaphone,
  BarChart3,
  Briefcase,
  Palette,
  Wallet,
  Users,
  Globe,
  ChevronRight,
} from "lucide-react";

// --- ICON MAPPING ---
const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("developer") || n.includes("it") || n.includes("software"))
    return <Code />;
  if (n.includes("marketing") || n.includes("social")) return <Megaphone />;
  if (n.includes("business") || n.includes("analysis")) return <BarChart3 />;
  if (n.includes("design") || n.includes("creative")) return <Palette />;
  if (n.includes("finance") || n.includes("account")) return <Wallet />;
  if (n.includes("hr") || n.includes("human")) return <Users />;
  return <Briefcase />; // Default icon
};

const CategoryCarousel = () => {
  const navigate = useNavigate();
  const { loading, error } = useGetAllCategories();
  const { categories } = useSelector((store) => store.category);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto my-16 px-6">
        <div className="flex justify-center gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !categories?.length) return null;

  return (
    <section className="w-full bg-white py-12 border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Popular <span className="text-[#6A38C2]">Categories</span>
          </h2>
          <p className="text-gray-500 mt-2">
            Find the job that fits your skills and interests.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {categories.map((cat) => (
                <CarouselItem
                  key={cat._id}
                  className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div
                    onClick={() => navigate(`/jobs?category=${cat._id}`)}
                    className="group cursor-pointer bg-white border border-gray-100 rounded-2xl p-6 
                        shadow-sm hover:shadow-md hover:border-[#6A38C2]/30 
                        transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center gap-4 h-full"
                  >
                    {/* Icon Box */}
                    <div className="w-14 h-14 rounded-full bg-purple-50 text-[#6A38C2] flex items-center justify-center group-hover:bg-[#6A38C2] group-hover:text-white transition-colors duration-300">
                      {React.cloneElement(getCategoryIcon(cat.name), {
                        size: 24,
                      })}
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#6A38C2] transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-1 group-hover:text-[#6A38C2]/70">
                        <span>Explore</span> <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious className="absolute -left-4 md:-left-12 h-10 w-10 border-gray-200 hover:border-[#6A38C2] hover:text-[#6A38C2]" />
            <CarouselNext className="absolute -right-4 md:-right-12 h-10 w-10 border-gray-200 hover:border-[#6A38C2] hover:text-[#6A38C2]" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
