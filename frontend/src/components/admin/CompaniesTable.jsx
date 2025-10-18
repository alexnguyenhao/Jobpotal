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

  // 🚫 Nếu không có công ty
  if (!filterCompany.length) {
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        No companies found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-white border border-gray-100">
      <Table>
        <TableCaption className="text-gray-500 text-sm mb-4">
          A list of your registered companies
        </TableCaption>

        {/* Header */}
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700 py-4 text-center">
              Logo
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Company Name
            </TableHead>
            <TableHead className="font-semibold text-gray-700 py-4">
              Created Date
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700 py-4 pr-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {filterCompany.map((company) => (
            <TableRow
              key={company._id}
              className="hover:bg-gray-50 transition-all duration-200"
            >
              {/* Logo - Click mở profile */}
              <TableCell className="py-3 text-center">
                <div
                  onClick={() =>
                    company?._id && navigate(`/company/${company._id}`)
                  }
                  className="inline-block cursor-pointer hover:scale-105 transition-transform duration-150"
                  title="View company profile"
                >
                  <Avatar className="w-11 h-11 border border-gray-200 shadow-sm">
                    <AvatarImage src={company?.logo} alt={company?.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                      {company?.name?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TableCell>

              {/* Tên công ty */}
              <TableCell className="text-gray-800 font-medium py-3">
                {company?.name || "N/A"}
              </TableCell>

              {/* Ngày tạo */}
              <TableCell className="text-gray-600 py-3 text-sm">
                {company?.createdAt
                  ? new Date(company.createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </TableCell>

              {/* Hành động */}
              <TableCell className="text-right py-3 pr-6">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors" />
                  </PopoverTrigger>

                  <PopoverContent
                    side="left"
                    align="end"
                    className="w-44 bg-white shadow-md rounded-md border border-gray-200 p-2"
                  >
                    <div
                      onClick={() =>
                        company?._id && navigate(`/company/${company._id}`)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>View Profile</span>
                    </div>

                    <div
                      onClick={() =>
                        company?._id &&
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
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
