import React, { useEffect } from "react";
import HeroSection from "@/components/HeroSection.jsx";
import CategoryCarousel from "@/components/CategoryCarousel.jsx";
import LatestJobs from "@/components/LatestJobs.jsx";
import useGetAllJobs from "@/hooks/useGetAllJobs.jsx";
import JobByCategorySection from "@/components/JobByCategorySection.jsx";
import JobByCompanySection from "@/components/JobByCompanySection.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);
  return (
    <div>
      <HeroSection />
      <CategoryCarousel />
      <JobByCategorySection />
      <JobByCompanySection />
      <LatestJobs />
    </div>
  );
};
export default Home;
