import React, { useEffect, useState, useRef } from "react";
import useCV from "@/hooks/useCV";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  Eye,
  PlusCircle,
  UploadCloud,
  Loader2,
} from "lucide-react";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";
import { toast } from "sonner";

import modernThumbnail from "@/components/cv/assets/modern-thumbnail.jpg";
import classicThumbnail from "@/components/cv/assets/classic-thumbnail.jpg";
import creativeThumbnail from "@/components/cv/assets/creative-thumbnail.jpg";

const templateThumbnails = {
  modern: modernThumbnail,
  classic: classicThumbnail,
  creative: creativeThumbnail,
};

const CVList = () => {
  const { cvs, fetchMyCVs, deleteCV, createCVByUpload } = useCV();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [deleteId, setDeleteId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMyCVs();
  }, []);

  const uploadedCVs = cvs.filter((cv) => cv.type === "upload");
  const builderCVs = cvs.filter((cv) => cv.type === "builder");

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteCV(deleteId);
    setDeleteId(null);
    setDialogOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    try {
      setIsUploading(true);

      await createCVByUpload(file);

      await fetchMyCVs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      <div>
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-[#6A38C2]" /> Created CVs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Resumes created using our builder tool.
            </p>
          </div>
          <Button
            className="bg-[#6A38C2] hover:bg-[#592ab0] text-white"
            onClick={() => navigate("/cv/builder")}
          >
            <PlusCircle className="mr-2 w-4 h-4" /> Create New
          </Button>
        </div>

        {builderCVs.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">You haven't created any CVs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {builderCVs.map((cv) => (
              <div
                key={cv._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-200 group flex flex-col h-full"
              >
                <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={templateThumbnails[cv.template] ?? modernThumbnail}
                    alt="Template"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/cv/view/${cv._id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3
                    className="font-bold text-gray-900 truncate"
                    title={cv.title}
                  >
                    {cv.title || "Untitled CV"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4">
                    Updated: {new Date(cv.updatedAt).toLocaleDateString()}
                  </p>

                  <div className="mt-auto flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-[#6A38C2] border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white"
                      onClick={() => navigate(`/cv/builder?id=${cv._id}`)}
                    >
                      <FileText className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
                      onClick={() => {
                        setDeleteId(cv._id);
                        setDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UploadCloud className="text-blue-600" /> Uploaded Resumes
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              PDF files you have uploaded directly.
            </p>
          </div>

          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 w-4 h-4" />
              )}
              {isUploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {uploadedCVs.map((cv) => (
            <div
              key={cv._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col relative"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <FileText className="w-8 h-8 text-red-500" />
                </div>
                <div className="overflow-hidden">
                  <h3
                    className="font-medium text-gray-900 truncate w-full"
                    title={cv.title}
                  >
                    {cv.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {cv.fileData?.originalName || "document.pdf"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(cv.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex gap-2 border-t pt-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-sm h-8"
                  onClick={() => window.open(cv.fileData?.url, "_blank")}
                >
                  <Eye className="w-3 h-3 mr-1" /> View
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                  onClick={() => {
                    setDeleteId(cv._id);
                    setDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {uploadedCVs.length === 0 && (
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 p-6 cursor-pointer hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 transition-colors h-[180px]"
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
              ) : (
                <UploadCloud className="w-10 h-10 mb-2 opacity-50" />
              )}
              <span className="font-medium text-sm">
                {isUploading ? "Uploading..." : "Upload your PDF Resume"}
              </span>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete CV"
        message="Are you sure you want to delete this CV?"
      />
    </div>
  );
};

export default CVList;
