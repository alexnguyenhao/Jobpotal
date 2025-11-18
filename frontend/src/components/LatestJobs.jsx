import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Components
import LatestJobCards from "@/components/LatestJobCards";
import { Button } from "@/components/ui/button";

// Icons
import { ArrowRight, Briefcase } from "lucide-react";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  // Lấy 6 job mới nhất
  const displayedJobs = allJobs ? allJobs.slice(0, 6) : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
            </h2>
            <p className="text-gray-500 text-lg">
              Explore the most recent opportunities added to our platform.
            </p>
          </div>

          {/* View All Button */}
          <Button
            variant="outline"
            className="hidden md:flex items-center gap-2 border-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-all rounded-full px-6"
            onClick={() => navigate("/jobs")}
          >
            View All Jobs <ArrowRight size={16} />
          </Button>
        </div>

        {/* --- JOBS GRID --- */}
        {displayedJobs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedJobs.map((job) => (
              <motion.div key={job._id} variants={itemVariants}>
                <LatestJobCards job={job} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Briefcase className="text-gray-400 h-8 w-8" />
            </div>
            <p className="text-gray-500 font-medium text-lg">
              No job openings available at the moment.
            </p>
            <p className="text-gray-400 text-sm">Please check back later.</p>
          </div>
        )}

        {/* Mobile View All Button (Show only on mobile) */}
        <div className="mt-8 text-center md:hidden">
          <Button
            className="bg-[#6A38C2] text-white rounded-full px-8 w-full sm:w-auto"
            onClick={() => navigate("/jobs")}
          >
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
