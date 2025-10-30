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
import { Edit2, MoreHorizontal, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState([]);
  const navigate = useNavigate();

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
                    <div
                      onClick={() =>
                        company?._id && navigate(`/company/${company._id}`)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>View Profile</span>
                    </div>

                    <div
                      onClick={() =>
                        company?._id &&
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                      <span>Edit</span>
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
