import React, { useEffect, useState } from "react";
import useCV from "@/hooks/useCV";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, Eye, PlusCircle, FolderOpen } from "lucide-react";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";

import modernThumbnail from "@/components/cv/assets/modern-thumbnail.jpg";
import classicThumbnail from "@/components/cv/assets/classic-thumbnail.jpg";
import creativeThumbnail from "@/components/cv/assets/creative-thumbnail.jpg";

const templateThumbnails = {
  modern: modernThumbnail,
  classic: classicThumbnail,
  creative: creativeThumbnail,
};

const CVList = () => {
  const { cvs, fetchMyCVs, deleteCV } = useCV();
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyCVs();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    await deleteCV(deleteId);
    setDeleteId(null);
    setDialogOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your CV Collection</h1>

        <Button
          className="bg-[#6A38C2] hover:bg-[#592ab0] text-white"
          onClick={() => navigate("/cv/builder")}
        >
          <PlusCircle className="mr-2 w-4 h-4" /> Create New CV
        </Button>
      </div>

      {/* EMPTY STATE */}
      {cvs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <FolderOpen className="w-32 h-32 mx-auto opacity-60" />
          <p className="mt-4 text-lg font-medium">
            You haven’t created any CVs yet
          </p>
          <Button
            className="mt-5 bg-[#6A38C2] hover:bg-[#592ab0] text-white"
            onClick={() => navigate("/cv/builder")}
          >
            Create Your First CV
          </Button>
        </div>
      )}

      {/* CV GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {cvs.map((cv) => (
          <div
            key={cv._id}
            className="bg-white rounded-xl shadow-md border hover:shadow-2xl transition-all duration-200 overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="h-56 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={templateThumbnails[cv.template] ?? modernThumbnail}
                alt="CV Template Thumbnail"
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.target.src = "/assets/default-thumbnail.png")
                }
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="font-bold text-xl text-gray-800">{cv.title}</h2>

              <span className="inline-block mt-2 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700 capitalize">
                {cv.template}
              </span>

              <p className="mt-2 text-gray-500 text-sm">
                Created at:{" "}
                <span className="font-medium text-gray-700">
                  {new Date(cv.createdAt).toLocaleDateString()}
                </span>
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-5">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/cv/${cv._id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" /> View
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/cv/builder?id=${cv._id}`)}
                >
                  <FileText className="w-4 h-4 mr-1" /> Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setDeleteId(cv._id);
                    setDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONFIRM DELETE DIALOG */}
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
