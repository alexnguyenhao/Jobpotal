import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import useGetAllCategories from "../hooks/useGetAllCategoris";
import { useSelector } from "react-redux";

const CategoryCarousel = () => {
  const { loading, error } = useGetAllCategories();
  const { categories } = useSelector((store) => store.category);

  if (loading) {
    return (
      <div className="w-full text-center py-10 text-gray-500 font-medium">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-10 text-red-500 font-medium">
        ⚠️ {error}
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="w-full text-center py-10 text-gray-500 font-medium">
        No categories available.
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto my-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Explore by <span className="text-[#6A38C2]">Category</span>
      </h2>

      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {categories.map((cat) => (
              <CarouselItem
                key={cat._id}
                className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-full py-3 text-sm font-medium hover:bg-[#6A38C2] hover:text-white transition-colors duration-300"
                >
                  {cat.name}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white shadow-md border border-gray-200 hover:bg-gray-50 z-10" />
          <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white shadow-md border border-gray-200 hover:bg-gray-50 z-10" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
