import React, {useEffect} from 'react'
import NavBar from "@/components/shared/NavBar.jsx";
import HeroSection from "@/components/HeroSection.jsx";
import CategoryCarousel from "@/components/CategoryCarousel.jsx";
import LatestJobs from "@/components/LatestJobs.jsx";
import Footer from "@/components/Footer.jsx";
import useGetAllJobs from "@/hooks/useGetAllJobs.jsx";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
const Home = () => {
    useGetAllJobs();
    const {user} = useSelector(store =>store.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (user?.role === "recruiter") {
            navigate("/admin/companies");
        }
    }, []);
    return (
       <div>
           <NavBar />
           <HeroSection/>
           <CategoryCarousel/>
           <LatestJobs/>
           <Footer/>
       </div>
    )
}
export default Home