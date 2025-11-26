import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { createCompany, setSingleCompany } from "@/redux/companySlice";

const CompanyCreate = () => {
  const [companyName, setCompanyName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Please enter a valid company name.");
      return;
    }
    if (!taxCode.trim()) {
      toast.error("Please enter a valid tax code.");
      return;
    }
    try {
      const resultAction = await dispatch(
        createCompany({ companyName, taxCode })
      );
      if (createCompany.fulfilled.match(resultAction)) {
        const newCompany = resultAction.payload;
        dispatch(setSingleCompany(newCompany));
        navigate(`/recruiter/companies/${newCompany._id}`);
      } else {
        toast.error(resultAction.payload || "Failed to create company");
      }
    } catch (error) {
      console.error("❌ Error creating company:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 pt-[70px]">
      <div className="my-10">
        <h1 className="font-bold text-2xl">Your company name</h1>
        <p className="text-gray-500">
          What would you like to name your company? You can change this later.
        </p>
      </div>
      <Label>Company Name</Label>
      <Input
        type="text"
        className="my-2"
        placeholder="JobHunt, Microsoft, etc."
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <Label>Tax Code</Label>
      <Input
        type="text"
        className="my-2"
        placeholder="123456789"
        value={taxCode}
        onChange={(e) => setTaxCode(e.target.value)}
      />
      <div className="flex items-center gap-2 my-10">
        <Button
          variant="outline"
          onClick={() => navigate("/recruiter/companies")}
        >
          Cancel
        </Button>
        <Button onClick={handleCreateCompany}>Continue</Button>
      </div>
    </div>
  );
};

export default CompanyCreate;
