import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Science",
  "Graphic Designer",
  "UI/UX Designer",
  "Mobile Developer",
];

const CategoryCarousel = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Explore by <span className="text-[#6A38C2]">Category</span>
      </h2>

      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-full py-3 text-sm font-medium hover:bg-[#6A38C2] hover:text-white transition-colors duration-300"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* ✅ Buttons cách item 1 khoảng */}
          <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white shadow-md border border-gray-200 hover:bg-gray-50 z-10" />
          <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white shadow-md border border-gray-200 hover:bg-gray-50 z-10" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
