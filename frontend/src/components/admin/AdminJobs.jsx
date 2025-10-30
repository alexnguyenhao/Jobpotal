import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminJobsTable from "@/components/admin/AdminJobsTable.jsx";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs.jsx";
import { setSearchJobsByText } from "@/redux/jobSlice.js";
const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchJobsByText(input));
  }, [input]);
  return (
    <div>
      <div className="pt-[70px]">
        <div className="max-w-6xl mx-auto my-10">
          <div className="flex items-center justify-between my-5">
            <Input
              className="w-fit"
              placeholder="Filter by name"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => navigate("/admin/jobs/create")}>
              Post Job
            </Button>
          </div>
          <AdminJobsTable />
        </div>
      </div>
    </div>
  );
};
export default AdminJobs;
