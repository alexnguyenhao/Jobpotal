import React, { useState } from "react";
import useAdminCompanies from "../../hooks/adminhooks/useAdminCompanies";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Loader2,
  MoreHorizontal,
  Globe,
  MapPin,
  CheckCircle,
  XCircle,
  Building2,
} from "lucide-react";

const Companies = () => {
  const navigate = useNavigate();
  const { companies, loading, toggleCompanyStatus } = useAdminCompanies();
  const [filterText, setFilterText] = useState("");

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[80vh]">
      {/* --- HEADER & SEARCH --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Registered Companies
          </h1>
          <p className="text-sm text-gray-500">
            Total companies:{" "}
            <span className="font-medium text-gray-900">
              {companies.length}
            </span>
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search company..."
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="rounded-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-gray-50/50">
            <Loader2 className="animate-spin text-[#6A38C2]" size={30} />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[300px] pl-6">
                  Company Profile
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Date Registered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <TableRow
                    key={company._id}
                    className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    {/* 1. Company Profile */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border border-gray-100 bg-white shadow-sm rounded-lg">
                          <AvatarImage
                            src={company.logo}
                            className="object-contain p-1"
                          />
                          <AvatarFallback className="rounded-lg bg-purple-50 text-[#6A38C2] font-bold">
                            {company.name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col max-w-[200px]">
                          <span
                            className="font-semibold text-gray-900 truncate"
                            onClick={() =>
                              navigate(`/admin/companies/${company._id}`)
                            }
                          >
                            {company.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {company.description || "No description provided."}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Location */}
                    <TableCell>
                      {company.location ? (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="truncate max-w-[150px]">
                            {company.location}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">--</span>
                      )}
                    </TableCell>

                    {/* 3. Website */}
                    <TableCell>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline hover:text-blue-700"
                        >
                          <Globe size={14} />
                          Visit
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">--</span>
                      )}
                    </TableCell>

                    {/* 4. Date */}
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(company.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>

                    {/* 5. Status Badge */}
                    <TableCell>
                      <Badge
                        className={`
                          ${
                            company.isVerified
                              ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
                          } px-2.5 py-0.5 rounded-full font-medium shadow-none border capitalize
                        `}
                      >
                        {company.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>

                    {/* 6. Action Menu */}
                    <TableCell className="text-right pr-6">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-1" align="end">
                          <div className="flex flex-col gap-1">
                            {/* Toggle Status Action */}
                            <div
                              onClick={() => toggleCompanyStatus(company._id)}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                                company.isVerified
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {company.isVerified ? (
                                <>
                                  <XCircle size={16} /> Block / Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} /> Approve Company
                                </>
                              )}
                            </div>

                            {/* View Details Action (Placeholder) */}
                            <div
                              onClick={() =>
                                console.log("View details", company._id)
                              }
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                            >
                              <Building2 size={16} className="text-gray-400" />
                              View Details
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                      <p>No companies found matching your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Companies;
