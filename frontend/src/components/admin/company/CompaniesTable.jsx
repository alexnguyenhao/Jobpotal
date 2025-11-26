import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { deleteCompany, fetchCompanies } from "@/redux/companySlice.js";
import { toast } from "sonner";
import { format } from "date-fns"; // Gợi ý: Dùng thư viện này format ngày cho đẹp (npm install date-fns)

// --- UI COMPONENTS ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge"; // Nếu chưa có: npx shadcn-ui@latest add badge

import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Globe,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// --- SHARED ---
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

const CompaniesTable = () => {
  const { companies, loading } = useSelector((store) => store.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local State
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useGetAllCompanies();

  const filterCompanies =
    companies?.filter((company) =>
      searchTerm
        ? company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    ) || [];

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedCompany) return;

    dispatch(deleteCompany(selectedCompany._id))
      .then(() => {
        dispatch(fetchCompanies());
        toast.success(`Deleted "${selectedCompany.name}" successfully!`);
      })
      .catch(() => {
        toast.error("Failed to delete company");
      })
      .finally(() => {
        setOpenDialog(false);
      });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Companies
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your registered organizations.
          </p>
        </div>
        <Button
          asChild
          className="bg-black hover:bg-gray-800 text-white shadow-md transition-all"
        >
          <Link to="/recruiter/companies/create">
            <PlusCircle size={18} className="mr-2" /> Register Company
          </Link>
        </Button>
      </div>

      {/* --- MAIN CARD --- */}
      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">
              Total Companies: {companies.length}
            </CardTitle>

            {/* Search Bar stylized */}
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* LOADING STATE */}
          {loading && (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filterCompanies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <Building2 className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No companies found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or register a new one.
              </p>
            </div>
          )}

          {/* TABLE */}
          {!loading && filterCompanies.length > 0 && (
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[350px] pl-6">Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Verified</TableHead>
                  <TableHead className="text-right pr-6">Date</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterCompanies.map((company) => (
                  <TableRow
                    key={company._id}
                    className="group hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-0"
                  >
                    {/* 1. Profile Info */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 rounded-xl border border-gray-100 shadow-sm bg-white">
                          <AvatarImage
                            src={company?.logo}
                            className="object-contain p-1"
                          />
                          <AvatarFallback className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 font-bold text-lg">
                            {company?.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <Link
                            to={`/company/${company._id}`}
                            className="font-semibold text-gray-900 hover:text-[#6A38C2] transition-colors text-base"
                          >
                            {company?.name}
                          </Link>
                          <span className="text-sm text-gray-500 truncate max-w-[200px]">
                            {company?.description || "No description provided"}
                          </span>
                          {/* Website mini link */}
                          {company?.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                            >
                              <Globe size={10} /> {company.website}
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Location */}
                    <TableCell>
                      {company?.location ? (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin
                            size={14}
                            className="text-gray-400 shrink-0"
                          />
                          <span className="truncate max-w-[150px]">
                            {company.location}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">--</span>
                      )}
                    </TableCell>

                    {/* 3. Status (Badge) */}
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary" // Hoặc dùng variant của bạn
                        className={`${
                          company?.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                        } px-2.5 py-0.5 rounded-full font-normal shadow-none border`}
                      >
                        {company?.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* 4. Verified */}
                    <TableCell className="text-center">
                      {company?.isVerified ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <CheckCircle2 className="h-5 w-5 text-blue-500 mx-auto" />
                            </TooltipTrigger>
                            <TooltipContent>Verified Company</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-red-500">Not Verified</span>
                      )}
                    </TableCell>

                    {/* 5. Date */}
                    <TableCell className="text-right text-gray-500 text-sm pr-6">
                      {company?.createdAt
                        ? company.createdAt.split("T")[0] // Hoặc dùng format(new Date(company.createdAt), 'dd MMM yyyy')
                        : "N/A"}
                    </TableCell>

                    {/* 6. Actions */}
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Button
                          asChild
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Link to={`/recruiter/companies/${company._id}`}>
                            <Edit size={14} />
                          </Link>
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                          onClick={() => handleDeleteClick(company)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Company"
        message={`Are you sure you want to delete "${selectedCompany?.name}"?`}
      />
    </div>
  );
};

export default CompaniesTable;
