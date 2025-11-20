import React, { useEffect, useState } from "react";
import CompaniesTable from "@/components/admin/company/CompaniesTable.jsx";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies.jsx";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice.js";
const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <div>
      <div>
        <div className="max-w-7xl mx-auto my-10">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};
export default Companies;
