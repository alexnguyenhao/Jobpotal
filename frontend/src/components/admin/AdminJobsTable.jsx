import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

// --- IMPORT API & REDUX ---
import { setAllAdminJobs } from "@/redux/jobSlice";
import { deleteJobById } from "@/hooks/useGetJobs"; // Import hàm API trực tiếp

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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- ICONS ---
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Building2,
} from "lucide-react";

// --- SHARED ---
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

// Hàm format địa chỉ
const formatLocation = (loc) => {
  if (!loc) return "No location";
  if (typeof loc === "string") return loc;
  const { address, district, province } = loc;
  return [address, district, province].filter(Boolean).join(", ");
};

const AdminJobsTable = () => {
  const { allAdminJobs, loading } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ ---
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 1. LOGIC LỌC (SEARCH) ---
  const filterJobs =
    allAdminJobs?.filter((job) => {
      if (!searchTerm) return true;
      const text = searchTerm.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(text) ||
        job?.company?.name?.toLowerCase().includes(text)
      );
    }) || [];

  // --- 2. LOGIC XÓA TRỰC TIẾP TẠI ĐÂY ---
  const handleDeleteClick = (id) => {
    setSelectedJobId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJobId) return;

    setIsDeleting(true); // Bật loading nút xóa

    try {
      // Gọi API
      const success = await deleteJobById(selectedJobId);

      if (success) {
        // Cập nhật Redux ngay lập tức (Optimistic UI)
        const updatedJobs = allAdminJobs.filter(
          (job) => job._id !== selectedJobId
        );
        dispatch(setAllAdminJobs(updatedJobs));

        toast.success("Job deleted successfully");
      } else {
        toast.error("Failed to delete job");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false); // Tắt loading
      setOpenDialog(false); // Đóng dialog
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Job Listings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your job postings and view applicant statuses.
          </p>
        </div>
        <Button
          asChild
          className="bg-black hover:bg-gray-800 text-white shadow-md transition-all"
        >
          <Link to="/admin/jobs/create">
            <PlusCircle size={18} className="mr-2" /> Post New Job
          </Link>
        </Button>
      </div>

      {/* MAIN CARD */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Active Jobs</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs or companies..."
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
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filterJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No jobs found
              </h3>
              <p className="text-gray-500 max-w-sm mt-2">
                Try adjusting your search or post a new job opening.
              </p>
            </div>
          )}

          {/* TABLE LIST */}
          {!loading && filterJobs.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[400px]">
                      Job Role & Company
                    </TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Date Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterJobs.map((job) => (
                    <TableRow
                      key={job._id}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      {/* 1. Info */}
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 rounded-lg border bg-white">
                            <AvatarImage
                              src={job?.company?.logo}
                              className="object-contain"
                            />
                            <AvatarFallback className="rounded-lg bg-gray-100 text-gray-500">
                              <Building2 size={20} />
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <Link
                              to={`/admin/jobs/descriptions/${job._id}`}
                              className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 transition-colors"
                            >
                              {job?.title}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-medium text-gray-700">
                                {job?.company?.name}
                              </span>
                              {job?.location && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5">
                                    <MapPin size={12} />{" "}
                                    {formatLocation(job.location)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* 2. Applicants */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer font-normal"
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}/applicants`)
                          }
                        >
                          <Eye className="w-3 h-3 mr-1" />{" "}
                          {job?.applications?.length || 0} Applicants
                        </Badge>
                      </TableCell>

                      {/* 3. Date */}
                      <TableCell className="text-sm text-gray-500">
                        {job?.createdAt
                          ? new Date(job.createdAt).toLocaleDateString("en-GB")
                          : "N/A"}
                      </TableCell>

                      {/* 4. Actions */}
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-blue-600"
                                >
                                  <Link to={`/admin/jobs/edit/${job._id}`}>
                                    <Edit size={16} />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Job</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-green-600"
                                  onClick={() =>
                                    navigate(
                                      `/admin/jobs/${job._id}/applicants`
                                    )
                                  }
                                >
                                  <Eye size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Applicants</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-red-600"
                                  onClick={() => handleDeleteClick(job._id)}
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

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDeleteDialog
        open={openDialog}
        onClose={() => !isDeleting && setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Job Posting"
        message="Are you sure? This action will permanently delete the job and all associated applications."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
      />
    </div>
  );
};
export default AdminJobsTable;
