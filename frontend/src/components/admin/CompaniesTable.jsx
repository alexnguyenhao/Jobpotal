import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog"; // ✅ component xác nhận xóa
import { Edit2, MoreHorizontal, Eye } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCompany, fetchCompanies } from "@/redux/companySlice.js";

const CompaniesTable = () => {
  const { companies, searchCompanyByText, loading } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🟢 Lấy danh sách công ty khi component mount
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  // 🔍 Lọc công ty theo từ khóa tìm kiếm
  useEffect(() => {
    const filtered =
      companies?.filter((company) =>
        searchCompanyByText
          ? company?.name
              ?.toLowerCase()
              .includes(searchCompanyByText.toLowerCase())
          : true
      ) || [];
    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

  // 🗑️ Hàm thực thi xoá công ty
  const handleDeleteCompany = (companyId, companyName) => {
    dispatch(deleteCompany(companyId))
      .then(() => {
        dispatch(fetchCompanies());
        toast.success(`Deleted "${companyName}" successfully!`);
      })
      .catch(() => {
        toast.error("Failed to delete company");
      });
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500 font-medium bg-white rounded-xl shadow-sm border border-gray-100">
        Loading companies...
      </div>
    );
  }

  // 🚫 Không có dữ liệu
  if (!filterCompany.length) {
    return (
      <div className="text-center py-12 text-gray-500 font-medium border border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
        No companies found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-md bg-white border border-gray-100">
      <Table className="w-full text-sm">
        <TableCaption className="text-gray-500 text-sm py-3">
          A list of your registered companies
        </TableCaption>

        {/* ======= HEADER ======= */}
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-center font-semibold text-gray-700 py-4 w-[100px]">
              Logo
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4 w-[40%]">
              Company Name
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4 w-[20%]">
              Created Date
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 py-4 pr-6 w-[100px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* ======= BODY ======= */}
        <TableBody>
          {filterCompany.map((company) => (
            <TableRow
              key={company._id}
              className="hover:bg-gray-50 transition-all duration-200"
            >
              {/* Logo */}
              <TableCell className="py-4 text-center">
                <div
                  onClick={() =>
                    company?._id && navigate(`/company/${company._id}`)
                  }
                  className="inline-block cursor-pointer hover:scale-105 transition-transform duration-150"
                  title="View company profile"
                >
                  <Avatar className="w-10 h-10 border border-gray-200">
                    <AvatarImage src={company?.logo} alt={company?.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                      {company?.name?.charAt(0)?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TableCell>

              {/* Company name */}
              <TableCell className="text-gray-800 font-medium py-4">
                <span
                  onClick={() =>
                    company?._id && navigate(`/company/${company._id}`)
                  }
                  className="cursor-pointer hover:text-[#6A38C2] transition-colors"
                >
                  {company?.name || "N/A"}
                </span>
              </TableCell>

              {/* Created date */}
              <TableCell className="text-gray-600 py-4 text-sm">
                {company?.createdAt
                  ? new Date(company.createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right py-4 pr-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-gray-100 transition">
                      <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    side="left"
                    align="end"
                    className="w-44 bg-white shadow-lg rounded-md border border-gray-200 p-2"
                  >
                    {/* View */}
                    <div
                      onClick={() =>
                        company?._id && navigate(`/company/${company._id}`)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>View Profile</span>
                    </div>

                    {/* Edit */}
                    <div
                      onClick={() =>
                        company?._id &&
                        navigate(`/company/update/${company._id}`)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                      <span>Edit</span>
                    </div>

                    {/* ✅ Delete với Confirm Dialog */}
                    <div className="px-3 py-2 mt-1">
                      <ConfirmDeleteDialog
                        title="Delete Company"
                        description={`Are you sure you want to delete "${company.name}"? This action cannot be undone.`}
                        onConfirm={() =>
                          handleDeleteCompany(company._id, company.name)
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
