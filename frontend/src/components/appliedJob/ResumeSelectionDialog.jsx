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
import { Check, User, FileText } from "lucide-react"; // Thêm icon cho đẹp

export default function ResumeSelectionDialog({
  open,
  setOpen,
  resumes,
  onSelectResume,
  onSelectProfile,
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

    if (selectedOption === "profile") {
      onSelectProfile(coverLetter);
    } else {
      onSelectResume(selectedOption, coverLetter);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Resume to Apply</DialogTitle>
          <DialogDescription className="sr-only">
            Choose a resume or use your profile information to apply.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* ➤ Option 1: Apply with Profile */}
          <div
            onClick={() => setSelectedOption("profile")}
            className={`border rounded-lg p-4 cursor-pointer transition-all relative ${
              selectedOption === "profile"
                ? "border-[#6A38C2] bg-purple-50 ring-1 ring-[#6A38C2]"
                : "bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  selectedOption === "profile"
                    ? "bg-[#6A38C2] text-white"
                    : "bg-gray-200"
                }`}
              >
                <User size={20} />
              </div>
              <div>
                <h3
                  className={`font-semibold text-lg ${
                    selectedOption === "profile"
                      ? "text-[#6A38C2]"
                      : "text-gray-900"
                  }`}
                >
                  Use Profile Instead
                </h3>
                <p className="text-sm text-gray-600">
                  Apply using your default profile information
                </p>
              </div>
              {/* Icon Check khi được chọn */}
              {selectedOption === "profile" && (
                <div className="absolute top-4 right-4 text-[#6A38C2]">
                  <Check size={24} />
                </div>
              )}
            </div>
          </div>

          {/* ➤ Option 2: Resume List */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">
              Select a CV:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.map((cv) => (
                <div
                  key={cv._id}
                  onClick={() => setSelectedOption(cv._id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all relative ${
                    selectedOption === cv._id
                      ? "border-[#6A38C2] bg-purple-50 ring-1 ring-[#6A38C2]"
                      : "hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FileText
                      size={20}
                      className={
                        selectedOption === cv._id
                          ? "text-[#6A38C2]"
                          : "text-gray-500"
                      }
                    />
                    <div>
                      <h3 className="font-semibold text-base truncate pr-6">
                        {cv.title}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {cv.template}
                      </p>
                    </div>
                  </div>
                  {/* Icon Check khi được chọn */}
                  {selectedOption === cv._id && (
                    <div className="absolute top-4 right-4 text-[#6A38C2]">
                      <Check size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ➤ Cover Letter */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">
              Cover Letter{" "}
              <span className="text-gray-400 font-normal text-sm">
                (Optional)
              </span>
            </h3>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter here... Explain why you're a great fit for this position."
              className="min-h-[100px]"
            />
          </div>

          {/* ➤ Warning Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 text-justify leading-relaxed">
              <strong>WARNING:</strong> JobPortal advises all candidates to
              always stay cautious during the job search process and proactively
              research company information. If you encounter any suspicious job
              postings, please report it to JobPortal immediately via email at
              Jobportal@topcv.vn.
            </p>
          </div>
        </div>

        {/* ➤ Footer Actions */}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmApply}
            disabled={!selectedOption} // Disable nếu chưa chọn gì
            className="bg-[#6A38C2] hover:bg-[#5b30a6]"
          >
            Apply Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
