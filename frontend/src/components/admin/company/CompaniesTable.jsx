import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { deleteCompany, fetchCompanies } from "@/redux/companySlice.js";
import { toast } from "sonner";

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

  // ❗ CALL HOOK CORRECTLY (top-level)
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
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Companies
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your registered organizations and profiles.
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

      {/* --- MAIN CONTENT CARD --- */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Registered Companies</CardTitle>

            {/* Search Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name..."
                className="pl-9 bg-gray-50 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* LOADING STATE */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filterCompanies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No companies found
              </h3>
              <p className="text-gray-500 max-w-sm mt-2">
                You haven't registered any companies yet or your search returned
                no results.
              </p>
            </div>
          )}

          {/* DATA TABLE */}
          {!loading && filterCompanies.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[400px]">Company Profile</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Date Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterCompanies.map((company) => (
                    <TableRow
                      key={company._id}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      {/* 1. Profile Info */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 rounded-lg border bg-white shadow-sm">
                            <AvatarImage
                              src={company?.logo}
                              className="object-contain"
                            />
                            <AvatarFallback className="rounded-lg bg-gray-100 text-gray-500 font-bold">
                              {company?.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <Link
                              to={`/company/${company._id}`}
                              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                            >
                              {company?.name}
                            </Link>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[250px]">
                              {company?.description ||
                                "No description provided."}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* 2. Location */}
                      <TableCell className="text-sm text-gray-600">
                        {company?.location ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="truncate max-w-[150px]">
                              {company.location}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </TableCell>

                      {/* 3. Website (Optional Col) */}
                      <TableCell className="text-sm">
                        {company?.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-blue-600 hover:underline"
                          >
                            <Globe size={14} />
                            Visit
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No website
                          </span>
                        )}
                      </TableCell>

                      {/* 4. Date */}
                      <TableCell className="text-right text-sm text-gray-500">
                        {company?.createdAt
                          ? new Date(company.createdAt).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </TableCell>

                      {/* 5. Actions Buttons (Tooltip) */}
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <div className="flex items-center justify-end gap-1">
                            {/* View */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-green-600"
                                >
                                  <Link to={`/recruiter/companies/${company._id}`}>
                                    <Eye size={16} />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>

                            {/* Edit */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-blue-600"
                                >
                                  <Link to={`/recruiter/companies/${company._id}`}>
                                    {" "}
                                    {/* Note: Route edit của bạn có thể khác, check lại nhé */}
                                    <Edit size={16} />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Company</TooltipContent>
                            </Tooltip>

                            {/* Delete */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-red-600"
                                  onClick={() => handleDeleteClick(company)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDeleteDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Company"
        message={`Are you sure you want to delete "${selectedCompany?.name}"? This will also remove all associated jobs.`}
      />
    </div>
  );
};

export default CompaniesTable;
