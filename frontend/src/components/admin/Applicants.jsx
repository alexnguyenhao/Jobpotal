import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import ApplicantsTable from "@/components/admin/ApplicantsTable.jsx";
import { APPLICATION_API_END_POINT } from "@/utils/constant.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplication } from "@/redux/applicationSlice.js";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          {
            withCredentials: true,
          }
        );
        console.log("API response:", res.data); // Log để debug
        dispatch(setAllApplication(res.data.job)); // Lưu mảng applications
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchAllApplicants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto mt-[70px]">
        <h1 className="font-bold text-xl my-5">
          Applicants ({applicants?.applications?.length})
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;
