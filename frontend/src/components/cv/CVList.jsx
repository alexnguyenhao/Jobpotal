import React, { useEffect } from "react";
import useCV from "@/hooks/useCV";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, Eye, PlusCircle } from "lucide-react";

const templateThumbnails = {
  modern: "assets/modern-thumbnail.jpg",
  classic: "assets/classic-thumbnail.jpg",
  creative: "assets/creative-thumbnail.jpg",
};

const CVList = () => {
  const { cvs, fetchMyCVs, deleteCV } = useCV();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCVs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Danh sách CV của bạn</h1>

        <Button
          className="bg-[#6A38C2] hover:bg-[#592ab0] text-white"
          onClick={() => navigate("/cv/builder")}
        >
          <PlusCircle className="mr-2 w-4 h-4" /> Tạo CV mới
        </Button>
      </div>

      {/* EMPTY STATE */}
      {cvs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <img
            src="/empty-folder.png"
            className="w-40 mx-auto opacity-70"
            alt="empty"
          />
          <p className="mt-4 text-lg">Bạn chưa tạo CV nào</p>
          <Button
            className="mt-4 bg-[#6A38C2] text-white"
            onClick={() => navigate("/cv/builder")}
          >
            Tạo CV ngay
          </Button>
        </div>
      )}

      {/* CV GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {cvs.map((cv) => (
          <div
            key={cv._id}
            className="bg-white rounded-xl shadow-md border hover:shadow-xl transition overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="h-56 w-full overflow-hidden">
              <img
                src={
                  templateThumbnails[cv.template] || "/cv-templates/default.png"
                }
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="font-bold text-xl">{cv.title}</h2>

              <span className="inline-block mt-2 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                {cv.template}
              </span>

              <p className="mt-2 text-gray-500 text-sm">
                Created: {new Date(cv.createdAt).toLocaleDateString()}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/cv/view/${cv._id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" /> Xem
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/cv/builder?id=${cv._id}`)}
                >
                  <FileText className="w-4 h-4 mr-1" /> Sửa
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteCV(cv._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVList;
