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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Please enter a valid company name.");
      return;
    }

    try {
      const resultAction = await dispatch(
        createCompany({ companyName }) // gửi formData vào thunk
      );

      // Nếu createCompany thành công
      if (createCompany.fulfilled.match(resultAction)) {
        const newCompany = resultAction.payload;
        dispatch(setSingleCompany(newCompany)); // lưu vào store
        navigate(`/admin/companies/${newCompany._id}`);
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

      <div className="flex items-center gap-2 my-10">
        <Button variant="outline" onClick={() => navigate("/admin/companies")}>
          Cancel
        </Button>
        <Button onClick={handleCreateCompany}>Continue</Button>
      </div>
    </div>
  );
};

export default CompanyCreate;
