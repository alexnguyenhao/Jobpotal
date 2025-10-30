import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import CompaniesTable from "@/components/admin/CompaniesTable.jsx";
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
        <div className="max-w-6xl mx-auto my-10">
          <div className="flex items-center justify-between my-5">
            <Input
              className="w-fit"
              placeholder="Filter by name"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => navigate("/admin/companies/create")}>
              New Company
            </Button>
          </div>
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};
export default Companies;
