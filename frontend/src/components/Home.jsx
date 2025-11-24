import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import HeroSection from "@/components/HeroSection.jsx";
import CategoryCarousel from "@/components/CategoryCarousel.jsx";
import LatestJobs from "@/components/LatestJobs.jsx";
import JobByCategorySection from "@/components/JobByCategorySection.jsx";
import JobByCompanySection from "@/components/JobByCompanySection.jsx";

// Hooks & Actions
import useGetAllJobs from "@/hooks/useGetAllJobs.jsx";
import { fetchPublicCompanies } from "@/redux/companySlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  useGetAllJobs();
  useEffect(() => {
    dispatch(fetchPublicCompanies());
  }, [dispatch]);
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/recruiter/companies");
    }
  }, [user, navigate]);

  return (
    <div>
      <HeroSection />
      <CategoryCarousel />

      {/* Slide việc làm theo danh mục */}
      <JobByCategorySection />

      {/* Slide việc làm theo công ty top đầu */}
      <JobByCompanySection />

      {/* Danh sách việc làm mới nhất */}
      <LatestJobs />
    </div>
  );
};

export default Home;
