import React, { useEffect } from "react";
import NavBar from "@/components/shared/NavBar.jsx";
import { Button } from "@/components/ui/button.js";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label.js";
import { Input } from "@/components/ui/input.js";
import { Textarea } from "@/components/ui/textarea.js"; // Giả sử có component Textarea
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { COMPANY_API_END_POINT } from "@/utils/constant.js";
import { useSelector } from "react-redux";
import usegetCompanyById from "@/hooks/usegetCompanyById.jsx";

const CompanySetup = () => {
  const params = useParams();
  usegetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onFileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setIsLoading(true);
      const res = await axios.put(
          `${COMPANY_API_END_POINT}/update/${params.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany?.name || "",
      description: singleCompany?.description || "",
      website: singleCompany?.website || "",
      location: singleCompany?.location || "",
      file: null, // File không nên set từ logo vì không phải file thực tế
    });
  }, [singleCompany]);

  return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[80px]">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button
                  onClick={() => navigate("/admin/companies")}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Update Company</h1>
            </div>
            <form
                onSubmit={onSubmitHandler}
                className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Company Name
                  </Label>
                  <Input
                      id="name"
                      type="text"
                      name="name"
                      value={input.name}
                      onChange={onChangeHandler}
                      placeholder="e.g. Acme Corporation"
                      className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                      id="description"
                      name="description"
                      value={input.description}
                      onChange={onChangeHandler}
                      placeholder="Describe your company..."
                      className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                      rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                    Website
                  </Label>
                  <Input
                      id="website"
                      type="url"
                      name="website"
                      value={input.website}
                      onChange={onChangeHandler}
                      placeholder="e.g. https://www.example.com"
                      className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location
                  </Label>
                  <Input
                      id="location"
                      type="text"
                      name="location"
                      value={input.location}
                      onChange={onChangeHandler}
                      placeholder="e.g. New York, NY"
                      className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                    Company Logo
                  </Label>
                  <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition">
                    <Input
                        id="file"
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={onFileChangeHandler}
                        className="hidden"
                    />
                    <label
                        htmlFor="file"
                        className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                    >
                      {input.file ? input.file.name : "Click to upload or drag and drop (PNG, JPG)"}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                {isLoading ? (
                    <Button disabled className="w-full  text-white ">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className="w-full  text-white  rounded-md py-2"
                    >
                      Update Company
                    </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default CompanySetup;