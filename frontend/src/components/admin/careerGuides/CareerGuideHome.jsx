import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useCareerGuide from "@/hooks/useCareerGuide";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Edit,
  Trash2,
  Eye,
  Search,
  FileText,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";

// --- DIALOG ---
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

const CareerGuideHome = () => {
  const { myGuides, loading, fetchMyGuides, deleteGuide } = useCareerGuide();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthenticated) fetchMyGuides();
  }, [isAuthenticated]);

  // Filter logic (Client-side)
  const filteredGuides = myGuides?.filter((guide) =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteDialog = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    const ok = await deleteGuide(selectedId);
    if (ok) fetchMyGuides();
    setOpenDialog(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Career Guides
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage articles, tips, and resources for candidates.
          </p>
        </div>
        <Button
          asChild
          className="bg-black hover:bg-gray-800 text-white shadow-md transition-all"
        >
          <Link to="/recruiter/career-guides/create">
            <PlusCircle size={18} className="mr-2" /> Create Guide
          </Link>
        </Button>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Posts</CardTitle>

            {/* Search Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title..."
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
                  <Skeleton className="h-12 w-16 rounded-md" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-[40%]" />
                    <Skeleton className="h-3 w-[20%]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredGuides?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No guides found
              </h3>
              <p className="text-gray-500 max-w-sm mt-2">
                You haven't created any guides yet, or no results matched your
                search.
              </p>
              {searchTerm === "" && (
                <Button asChild variant="outline" className="mt-6">
                  <Link to="/recruiter/career-guides/create">
                    Create your first guide
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* TABLE LIST */}
          {!loading && filteredGuides?.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    {/* Tăng độ rộng cột để chứa Title */}
                    <TableHead className="w-[450px]">Article Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Stats</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuides.map((g) => (
                    <TableRow
                      key={g._id}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      {/* 1. ARTICLE INFO (Fix: Tooltip + Line Clamp) */}
                      <TableCell className="py-4 max-w-[450px]">
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0">
                            {g.thumbnail ? (
                              <img
                                src={g.thumbnail}
                                alt="thumb"
                                className="w-16 h-12 rounded-md object-cover border shadow-sm bg-gray-50"
                              />
                            ) : (
                              <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                <FileText size={20} />
                              </div>
                            )}
                          </div>

                          {/* Text Info */}
                          <div className="space-y-1 min-w-0 flex-1">
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    to={`/recruiter/career-guides/detail/${g._id}`}
                                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block leading-snug line-clamp-2 break-words"
                                  >
                                    {g.title}
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[400px] bg-slate-900 text-white border-none shadow-xl p-3">
                                  <p className="leading-relaxed">{g.title}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <div className="text-xs text-gray-500 truncate">
                              {g.excerpt || "No description available."}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* 2. STATUS */}
                      <TableCell>
                        <Badge
                          variant={g.isPublished ? "default" : "secondary"}
                          className={`font-normal px-2.5 py-0.5 ${
                            g.isPublished
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {g.isPublished ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 size={12} /> Published
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <FileText size={12} /> Draft
                            </span>
                          )}
                        </Badge>
                      </TableCell>

                      {/* 3. CATEGORY */}
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {g.category.replace("-", " ")}
                        </Badge>
                      </TableCell>

                      {/* 4. STATS */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 text-sm font-medium">
                          <Eye size={14} /> {g.views}
                        </div>
                      </TableCell>

                      {/* 5. DATE */}
                      <TableCell className="text-right text-sm text-gray-500">
                        {new Date(g.updatedAt).toLocaleDateString("en-GB")}
                      </TableCell>

                      {/* 6. ACTIONS */}
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit Button */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-blue-600"
                                >
                                  <Link
                                    to={`/recruiter/career-guides/edit/${g._id}`}
                                  >
                                    <Edit size={16} />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Guide</TooltipContent>
                            </Tooltip>

                            {/* Delete Button */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-red-600"
                                  onClick={() => openDeleteDialog(g._id)}
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

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDeleteDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        message="Are you sure you want to delete this guide? This action cannot be undone."
      />
    </div>
  );
};

export default CareerGuideHome;
