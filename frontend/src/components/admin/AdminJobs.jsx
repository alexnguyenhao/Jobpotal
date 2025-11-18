import React from "react";
import AdminJobsTable from "@/components/admin/AdminJobsTable.jsx";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs.jsx";

const AdminJobs = () => {
  // Hook này chỉ nhiệm vụ fetch data về Redux store
  useGetAllAdminJobs();

  return (
    <div>
      <div>
        <div className="max-w-7xl mx-auto my-10">
          <AdminJobsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
