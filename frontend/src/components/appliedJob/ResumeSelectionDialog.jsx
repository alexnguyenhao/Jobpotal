import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, LayoutTemplate, Paperclip, UploadCloud } from "lucide-react";

export default function ResumeSelectionDialog({
  open,
  setOpen,
  resumes = [],
  onSelectResume,
  // Đã xóa onSelectProfile vì backend bắt buộc phải có CV
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (open) {
      setCoverLetter("");
      setSelectedOption(null);
    }
  }, [open]);

  const handleConfirmApply = () => {
    if (!selectedOption) return;
    // Chỉ còn duy nhất 1 logic: Chọn CV để apply
    onSelectResume(selectedOption, coverLetter);
  };

  // --- HELPER MỚI: Dùng field 'type' từ Model ---
  const isUploadCV = (cv) => {
    // Check theo model mới (type) hoặc fallback model cũ (resumeOriginalName)
    return (
      cv.type === "upload" ||
      (cv.resumeOriginalName && cv.resumeOriginalName.trim() !== "")
    );
  };

  // Chia danh sách
  const builderCVs = resumes.filter((cv) => !isUploadCV(cv));
  const uploadedCVs = resumes.filter((cv) => isUploadCV(cv));

  // Component Item
  const CVItem = ({ cv, isPdf }) => {
    const isSelected = selectedOption === cv._id;

    // Lấy tên hiển thị chuẩn
    const displayName = isPdf
      ? cv.fileData?.originalName || cv.resumeOriginalName || "Unnamed PDF"
      : cv.title || "Untitled CV";

    const displaySubtitle = isPdf
      ? "PDF File"
      : `Template: ${cv.template || "Modern"}`;

    return (
      <div
        onClick={() => setSelectedOption(cv._id)}
        className={`border rounded-xl p-3 cursor-pointer transition-all relative flex items-center gap-3 ${
          isSelected
            ? "border-[#6A38C2] bg-purple-50 shadow-sm ring-1 ring-[#6A38C2] ring-opacity-20"
            : "border-gray-200 hover:border-gray-400 bg-white"
        }`}
      >
        {/* Icon */}
        <div
          className={`p-2 rounded-lg shrink-0 ${
            isPdf ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
          }`}
        >
          {isPdf ? <Paperclip size={20} /> : <LayoutTemplate size={20} />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold text-sm truncate ${
                isSelected ? "text-[#6A38C2]" : "text-gray-900"
              }`}
            >
              {displayName}
            </h3>
          </div>

          <p className="text-xs text-gray-500 truncate mt-0.5">
            {displaySubtitle}
          </p>
        </div>

        {/* Checkbox */}
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-[#6A38C2] border-[#6A38C2]"
              : "border-gray-300 bg-white"
          }`}
        >
          {isSelected && <Check size={12} className="text-white" />}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0 rounded-xl">
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 bg-gray-50 border-b shrink-0">
          <DialogTitle className="text-xl text-gray-900">
            Apply for this Job
          </DialogTitle>
          <DialogDescription>
            Select a CV to attach to your application.
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto bg-gray-50/30">
          {/* List CVs */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Select from CV Library
              </h4>
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {resumes.length} available
              </span>
            </div>

            {resumes.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-xl bg-gray-50">
                <p className="text-gray-500 text-sm">
                  You haven't created any CVs yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Group 1: Builder */}
                {builderCVs.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                      <LayoutTemplate size={12} /> Created on Web
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {builderCVs.map((cv) => (
                        <CVItem key={cv._id} cv={cv} isPdf={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Group 2: Upload */}
                {uploadedCVs.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-2 mt-2 flex items-center gap-1">
                      <UploadCloud size={12} /> Uploaded Files
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {uploadedCVs.map((cv) => (
                        <CVItem key={cv._id} cv={cv} isPdf={true} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Cover Letter{" "}
              <span className="text-gray-400 font-normal text-xs">
                (Optional)
              </span>
            </h4>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you the best candidate for this job?"
              className="min-h-[100px] resize-none focus-visible:ring-[#6A38C2] bg-white"
            />
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex gap-3">
            <div className="text-orange-500 shrink-0 mt-0.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className="text-xs text-orange-800 text-justify leading-relaxed">
              <strong>Note:</strong> You can apply a maximum of{" "}
              <strong>3 times</strong> for the same job. Please ensure your CV
              is tailored for this position.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 bg-white border-t sm:justify-between items-center z-10 shrink-0">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmApply}
            disabled={!selectedOption}
            className="bg-[#6A38C2] hover:bg-[#5b30a6] px-8"
          >
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
