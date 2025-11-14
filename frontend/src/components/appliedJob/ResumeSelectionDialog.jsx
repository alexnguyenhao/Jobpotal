import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function ResumeSelectionDialog({
  open,
  setOpen,
  resumes,
  onSelectResume,
  onSelectProfile,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select a Resume to Apply</DialogTitle>
        </DialogHeader>

        {/* ➤ Option 1: Apply with Profile */}
        <div className="border rounded-lg p-4 bg-gray-50 hover:border-[#6A38C2] cursor-pointer mb-4">
          <h3 className="font-semibold text-lg text-[#6A38C2]">
            Use Profile Instead
          </h3>
          <p className="text-sm text-gray-600">
            Apply using your default profile information
          </p>
          <Button className="mt-3 w-full" onClick={() => onSelectProfile()}>
            Use Profile
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {resumes.map((cv) => (
            <div
              key={cv._id}
              className="border rounded-lg p-4 hover:border-[#6A38C2] hover:shadow-md"
            >
              <h3 className="font-semibold text-lg">{cv.title}</h3>
              <p className="text-sm text-gray-600 capitalize">{cv.template}</p>
              <Button
                className="mt-3 w-full"
                onClick={() => onSelectResume(cv._id)}
              >
                Use This Resume
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
